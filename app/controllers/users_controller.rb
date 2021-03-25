class UsersController < ApplicationController

    def index
        if session[:user_id] != nil
            @current_user = User.find_by(id: session[:user_id])
        end
    end

    def contact

    end

    def about

    end

    def profile
        if session[:user_id] != nil
            @current_user = User.find_by(id: session[:user_id])
        else
            redirect_to '/'
        end
    end

    def create
        first = user_params[:first]
        last = user_params[:last]
        
        name = first + " " + last

        email_first = user_params[:email_first]
        email_last = user_params[:email_last]

        email = email_first + "@" + email_last
        username = user_params[:username]
        user = User.new({name: name, username: username, email: email, password: user_params[:password]})
        if user.save
            session[:user_id] = user.id
            redirect_to '/nanobot'
        else
            flash[:register_errors] = user.errors.full_messages 
            redirect_to '/'
        end
    end

    def sign_in
        user = User.find_by(username: login_params[:login_username])
        if user && user.authenticate(login_params[:login_password])
            session[:user_id] = user.id
            redirect_to '/nanobot'
        else
            redirect_to '/'
        end
    end

    def sign_out
        session[:user_id] = nil
        redirect_to '/'
    end

    private
    def user_params
        params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password)
    end

    def login_params
        params.require(:user).permit(:login_username, :login_password)
    end

end
