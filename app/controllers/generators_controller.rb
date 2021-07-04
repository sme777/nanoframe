class GeneratorsController < ApplicationController
    def index
        if session[:user_id] != nil
            @current_user = User.find_by(id: session[:user_id])
        end
        @generator = Generator.new
    end

    def new
        #@generator = Generator.new
    end

    def show
        @generator = Generator.find(params[:id])
        render :show
    end

    def create
        @generator = Generator.new(generator_params)

        if @generator.save
            redirect_to '/nanobot/' + @generator.id.to_s
        else
            render :index
        end
    end

    private
    def generator_params
        params.require(:generator).permit(:height, :width, :depth, :option,
            :radius, :radial_segment, :radius_top, :radius_bottom, :width_segment, :detail,
            :heigh_segment, :tube_radius, :tubular_radius, :p, :q, :scaffold_length, :shape)
    end
end