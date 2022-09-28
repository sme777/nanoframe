class CommentsController < ApplicationController

    def destroy

    end

    def create
        if params[:user_id] && !User.where(id: params[:user_id]).empty? && !Generator.where(id: params[:id]).empty?
            comment = Comment.create(content: params[:content], upvotes: 0, user_id: params[:user_id].to_i, generator_id: params[:id].to_i)
        end
        redirect_to "/synthesizer/#{params[:id]}/visualize"
    end
end