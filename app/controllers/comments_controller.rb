class CommentsController < ApplicationController

    before_action :find_generator

    def create
        if params[:user_id] && !User.where(id: params[:user_id]).empty? && !Generator.where(id: params[:id]).empty?
            @comment = Comment.create(content: params[:content], upvotes: 0, user_id: params[:user_id].to_i, generator_id: params[:id].to_i)
        end
        render partial: "comment_section"
    end

    def update
        if !Comment.where(id: params[:comment_id]).empty?
            Comment.find_by(id: params[:comment_id]).update(content: params[:comment_content])
        end
        render partial: "comment", locals: {comment: Comment.find_by(id: params[:comment_id])}
    end

    def cancel_update
        if !Comment.where(id: params[:comment_id]).empty?
            render partial: "comment", locals: {comment: Comment.find_by(id: params[:comment_id])}
        end
    end


    def edit
        if !Comment.where(id: params[:comment_id]).empty?
            render partial: "edit_comment", locals: {comment: Comment.find_by(id: params[:comment_id])}
        end
    end

    def destroy
        if params[:comment_id] && !Comment.where(id: params[:comment_id]).empty?
            Comment.delete(params[:comment_id])
        end
        render partial: "comment_section"
    end

    def comment_tab
        render partial: "comment_section"
    end

    def find_generator
        @generator =  Generator.find_by(id: params[:id])
    end
end