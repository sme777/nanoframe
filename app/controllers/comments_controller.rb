class CommentsController < ApplicationController

    def destroy
        if params[:comment_id] && !Comment.where(id: params[:comment_id]).empty?
            Comment.delete(params[:comment_id])
        end
        render "comment_section"
    end

    def create
        if params[:user_id] && !User.where(id: params[:user_id]).empty? && !Generator.where(id: params[:id]).empty?
            @comment = Comment.create(content: params[:content], upvotes: 0, user_id: params[:user_id].to_i, generator_id: params[:id].to_i)
        end
        @generator = Generator.find_by(id: params[:id])
        render "comment_section"
    end
end