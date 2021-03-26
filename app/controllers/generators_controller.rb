class GeneratorsController < ApplicationController
    def index
        if session[:user_id] != nil
            @current_user = User.find_by(id: session[:user_id])
        end
    end
end