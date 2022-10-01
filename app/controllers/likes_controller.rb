class LikesController < ApplicationController
    before_action :find_generator, :has_liked
    # after_action :render_turboframe, only: [:create, :destory, :like_tab]

    def create
        # byebug
        if !!@current_user && !@generator.nil?
            @already_liked = !@generator.likes.filter {|like| like.user_id == @current_user.id}.empty?
            if !@already_liked
                @like = Like.create(user_id: @current_user.id, generator_id: @generator.id)
                @already_liked = true
            end
        end
        find_generator
        render partial: "like_section"
    end

    def destroy
        if !!@current_user && !@generator.nil? && @already_liked
            Like.delete(params[:like_id])
            @already_liked = false
        end
        find_generator
        render partial: "like_section"
    end
    
    def like_tab
        render partial: "like_section"
    end
    
    def has_liked
        if @current_user.nil?
            @already_liked = false
        else
            @like = @generator.likes.filter {|like| like.user_id == @current_user.id}[0]
            @already_liked = !!@like
        end
    end

    def find_generator
        @generator =  Generator.find_by(id: params[:id])
    end

    def render_turboframe
        byebug
        render partial: "like_section"
    end
end
