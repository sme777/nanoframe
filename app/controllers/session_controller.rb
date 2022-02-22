class SessionController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create


  def google_oauth2
    create_session(:create_google_user)
  end

  def github
    create_session(:create_github_user)
  end

  def create_session(create_if_not_exists)
    user_info = request.env['omniauth.auth']
    user = find_or_create_user(user_info, create_if_not_exists)
    session[:user_id] = user.id
    redirect_to root_path
  end

  def find_or_create_user(user_info, create_if_not_exists)
    provider = user_info['provider']
    user = User.find_by(
      provider: provider,
      id: user_info['uid']
    )
    return user unless user.nil?

    send(create_if_not_exists, user_info)
  end

  def create_google_user(user_info)
    User.create(
      id: user_info['uid'],
      provider: User.providers[:google_oauth2],
      first_name: user_info['info']['first_name'],
      last_name: user_info['info']['last_name'],
      email: user_info['info']['email']
    )
  end

  def create_github_user(user_info)
    name = user_info['info']['name']
    username = user_info['info']['nickname']
    if name.nil?
      first_name = 'Anon'
      last_name = 'User'
    else
      first_name, last_name = user_info['info']['name'].strip.split(/\s+/, 2)
    end
    User.create!(
      id: user_info['uid'],
      provider: :github,
      name: "#{first_name} #{last_name}",
      username: username,
      email: user_info['info']['email'],
      password: :password
    )
  end

  def auth_hash
    request.env['omniauth.auth']
  end
end
