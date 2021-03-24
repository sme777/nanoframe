class UsersController < ApplicationController

    def index
        
    end

    def contact

    end

    def about

    end

    def create
        #byebug
        first = user_params[:first]
        last = user_params[:last]
        
        name = first + " " + last

        email_first = user_params[:email_first]
        email_last = user_params[:email_last]

        email = email_first + "@" + email_last
        username = user_params[:username]
        #@x = user_params
        #byebug
        user = User.new({name: name, username: username, email: email, password: user_params[:password]})
        if user.save
            session[:user_id] = user.id
            redirect_to '/nanobot'
        else
            flash[:register_errors] = user.errors.full_messages 
            redirect_to '/'
        end
    end

    private
    def user_params
        params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password)
    end

end
