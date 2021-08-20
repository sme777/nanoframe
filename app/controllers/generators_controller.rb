class GeneratorsController < ApplicationController
    before_action :set_generator, except: [:create]
    
    def index
        #byebug
        #@options = @generator.get_shapes
        if session[:user_id] != nil
            @current_user = User.find_by(id: session[:user_id])
        end
    end

    def new
        #@generator = Generator.new
    end

    def shaper

    end

    def synthesize
        #@generator = Generator.find(params[:id])
        
        render :synthesize
    end

    def routing
        #@generator = Generator.find(params[:id])
        render :routing
    end

    def results
        #@generator = Generator.find(params[:id])
        render :results
    end

    def create
        @generator = Generator.new(generator_params)
        #byebug
        
        if @generator.save
            session['id'] = @generator.id
            redirect_to '/nanobot/' + @generator.id.to_s
        else
            render :index
        end
    end

    private
    def generator_params
        params.require(:generator).permit(:height, :width, :depth, :option, :depth_segment,
            :radius, :radial_segment, :radius_top, :radius_bottom, :width_segment, :detail,
            :heigh_segment, :tube_radius, :tubular_radius, :p, :q, :scaffold_length, :shape)
    end

    def set_generator
        if is_active_generator?
            begin
                @generator = Generator.find(generator_id)
            rescue ActiveRecord::RecordNotFound
                @generator = Generator.new
            end
            
        else
            @generator = Generator.new
        end
    end


    def is_active_generator?
        #byebug
        session[:id]
    end 

    def generator_id
        params[:id] || session[:id]
    end
end