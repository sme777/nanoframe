class UsersController < ApplicationController
  def index
    @current_user = User.find_by(id: session[:user_id]) unless session[:user_id].nil?
    if !@current_user.nil?
      @generators = @current_user.generators
    end
  end

  def miscellaneous; end

  def profile
    if !session[:user_id].nil?
      @current_user = User.find_by(id: session[:user_id])
    else
      redirect_to '/'
    end
  end

  def create
    first = user_params[:first]
    last = user_params[:last]

    name = first + ' ' + last

    email_first = user_params[:email_first]
    email_last = user_params[:email_last]

    email = email_first + '@' + email_last
    username = user_params[:username]
    user = User.new({ name: name, username: username, email: email, password: user_params[:password] })
    if user.save
      session[:user_id] = user.id
      redirect_to '/'
    else
      flash[:register_errors] = user.errors.full_messages
      redirect_to '/'
    end
  end

  def google_oauth2
    create_session(:create_google_user)
  end

  def github
    create_session(:create_github_user)
  end

  def create_session(create_if_not_exists)
    user_info = request.env['omniauth.auth']
    user = find_or_create_user(user_info, create_if_not_exists)
    session[:current_user_id] = user.id
    destination_url = session[:destination_after_login] || root_url
    session[:destination_after_login] = nil
    redirect_to destination_url
  end

  def find_or_create_user(user_info, create_if_not_exists)
    provider_sym = user_info['provider'].to_sym
    user = User.find_by(
        provider: User.providers[provider_sym],
        uid:      user_info['uid']
    )
    return user unless user.nil?

    send(create_if_not_exists, user_info)
  end

  def create_google_user(user_info)
    User.create(
        uid:        user_info['uid'],
        provider:   User.providers[:google_oauth2],
        first_name: user_info['info']['first_name'],
        last_name:  user_info['info']['last_name'],
        email:      user_info['info']['email']
    )
  end

  def create_github_user(user_info)
      # Unfortunately, Github doesn't provide first_name, last_name as separate entries.
      name = user_info['info']['name']
      if name.nil?
          first_name = 'Anon'
          last_name = 'User'
      else
          first_name, last_name = user_info['info']['name'].strip.split(/\s+/, 2)
      end
      User.create(
          uid:        user_info['uid'],
          provider:   User.providers[:github],
          first_name: first_name,
          last_name:  last_name,
          email:      user_info['info']['email']
      )
  end

  def sign_in
    user = User.find_by(username: login_params[:login_username])
    if user && user.authenticate(login_params[:login_password])
      session[:user_id] = user.id
      redirect_to '/'
    else
      flash[:danger] = 'Invalid Login Credentials'
      redirect_to '/'
    end
  end

  def sign_out
    session[:user_id] = nil
    redirect_to '/'
  end

  def check_email
    @user = User.find_by_email(params[:email])
    respond_to do |format|
      format.json { render json: { email_exists: @user.present? } }
    end
  end

  def check_username
    @user = User.find_by_username(params[:username])
    respond_to do |format|
      format.json { render json: { username_exists: @user.present? } }
    end
  end

  def get_contact
    redirect_to '/'
  end

  def add_generator(g)


  end

  private

  def user_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password)
  end

  def login_params
    params.require(:user).permit(:login_username, :login_password)
  end
end
