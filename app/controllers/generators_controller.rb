# frozen_string_literal: true

require 'json'

class GeneratorsController < ApplicationController
  before_action :set_generator, except: [:create]
  before_action :set_user
  skip_before_action :verify_authenticity_token

  def index
    @shapes = Generator.shapes
    @scaffolds = Generator.scaffolds
  end

  def custom; end

  def synthesize
    # @generator = Generator.find(params[:id])
    byebug
    sequence = JSON.parse(@generator.json)['sequence']
    coordinates = JSON.parse(@generator.vertices)['points']
    @generator.scaffold(sequence, coordinates)
    # @generator.route
    # @generator.feedback_control(coordinates)
    session[:filename] = @generator.filename(logged_in?, session[:user_id])
    render :synthesize
  end

  def routing
    @generator = Generator.find(generator_id)
    @graph_json = @generator.routing
    @staples_json = @generator.staples
    @scaffold = Generator.m13_scaffold
  end

  def visualize
    if params[:regenerate]
      @graph = @generator.route
      @graph_json = @graph.to_json
      @staples_json = @graph.staples_json
      Generator.find(@generator.id).update(routing: @graph_json, staples: @staples_json)
      redirect_to "/nanobot/#{@generator.id}/visualize"
    elsif @generator.routing.nil?
      @graph = @generator.route
      @graph_json = @graph.to_json
      @staples_json = @graph.staples_json
      @scaffold = Generator.m13_scaffold
      Generator.find(@generator.id).update(routing: @graph_json, staples: @staples_json)
    else
      @graph_json = @generator.routing
      @staples_json = @generator.staples
      @scaffold = Generator.m13_scaffold
    end
  end

  def compile
    redirect_to '/' if logged_in?
  end

  def create
    generator_fields = generator_params
    generator_fields[:scaffold_length] = Generator.scaffolds_to_length.stringify_keys[generator_fields[:scaffold_name]] 
    @generator = Generator.new(generator_fields)
    @generator.user_id = @current_user.id unless @current_user.nil?

    if @generator.save
      session['id'] = @generator.id
      redirect_to "/nanobot/#{@generator.id}/visualize"
    else
      flash[:message] = 'Could Not Complete Request'
      redirect_to '/nanobot'
    end
  end

  def generator
    @returned_results = false
    if !params[:step_size].nil? && params[:step_size] != '' && !params[:loopout_length].nil? && params[:loopout_length] != ''

      @step_size = params[:step_size]
      @loopout_length = params[:loopout_length]
      min = params[:min]
      max = params[:max]
      scaff_length = params[:scaff_length]
      @objects = Generator.generate_objects(@step_size, @loopout_length, min, max, scaff_length)
      @returned_results = true
    end
  end

  def signup_and_save
    first = user_generator_params[:first]
    last = user_generator_params[:last]

    name = "#{first} #{last}"

    email_first = user_generator_params[:email_first]
    email_last = user_generator_params[:email_last]

    email = "#{email_first}@#{email_last}"
    username = user_generator_params[:username]
    user = User.new({ name: name, username: username, email: email, password: user_params[:password] })
    user.add_generator(user_generator_params[:generator])
    if user.save
      session[:user_id] = user.id
      redirect_to '/'
    else
      flash[:register_and_save_errors] = user.errors.full_messages
      redirect_to "/nanobot/#{@generator.id}/compile"
    end
  end

  private

  def generator_params
    params.require(:generator).permit(:height, :width, :depth, :shape, :divisions, :scaffold_name)
  end

  def user_generator_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password, :generator)
  end
end
