# frozen_string_literal: true

class UsersController < ApplicationController
  def index

    if params[:type]
      filter_generators
    else
      @current_user = User.find_by(id: session[:user_id]) unless session[:user_id].nil?
      if !@current_user.nil?
        @first_page = 1
        @current_page =  params[:page].to_i || @first_page
        @last_page = (@current_user.generators.size / 5.0).ceil
        if @current_page < @first_page
          redirect_to "/home/#{@first_page}"
          return
        end

        if @current_page > @last_page
          redirect_to "/home/#{@last_page}"
          return
        end

        @generators = @current_user.generators
                                   .order(created_at: :desc)
                                   .paginate(:page => @current_page, :per_page => 5 )

      end
      
      @supported_files = Generator.supported_files
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

    name = "#{first} #{last}"

    email_first = user_params[:email_first]
    email_last = user_params[:email_last]

    email = "#{email_first}@#{email_last}"
    username = user_params[:username]
    user = User.new({ name: name, username: username, email: email, password: user_params[:password] })
    if user.save
      session[:user_id] = user.id
    else
      flash[:register_errors] = user.errors.full_messages
    end
    redirect_to '/'
  end

  def sign_in
    user = User.find_by(username: login_params[:login_username])
    if user&.authenticate(login_params[:login_password])
      session[:user_id] = user.id
    else
      flash[:danger] = 'Invalid Login Credentials'
    end
    redirect_to '/'
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

  def add_generator(g); end

  def filter_generators
    @supported_files = Generator.supported_files
    if params[:type] == "public"
      @generators = @current_user.generators.order(created_at: :desc).filter {|g| g.public}
    elsif params[:type] == "private"
      @generators = @current_user.generators.order(created_at: :desc).filter {|g| !g.public}
    else
      @generators = @current_user.generators.order(created_at: :desc)
    end
    # render :index
  end

  private

  def user_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password)
  end

  def login_params
    params.require(:user).permit(:login_username, :login_password)
  end
end
