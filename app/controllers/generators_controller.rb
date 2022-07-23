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

  def routing
    @generator = Generator.find(generator_id)
    @positions = @generator.positions
    @colors = @generator.colors
    @scaffold = @generator.scaffold
    @staples = JSON.generate(@generator.staples)
    @dimensions = @generator.dimensions
    @supported_files = Generator.supported_files
  end

  def download
    type = params[:type]
    unless type.nil?
      repl = {'(' => '', ')' => '', ' ' => '_'}
      type = type.gsub(Regexp.union(repl.keys), repl).downcase
      filename = @generator.filename(logged_in?, session[:user_id])
      files = @generator.send(type.downcase, filename)
      zipfile_name = "#{Rails.root.join('tmp')}/#{filename}.zip"
      if files.size == 1
        mime_type = ""
        if type.include?("staple")
          mime_type = "text/csv"
        elsif type.include?("nfr")
          mime_type = "application/json"
        elsif type.include?("pdb")
          mime_type = "chemical/pdb"
        end
        File.open("#{Rails.root.join('tmp')}/#{files[0]}", 'r') do |f|
          send_data f.read, type: mime_type, filename: files[0]
        end
        File.delete("#{Rails.root.join('tmp')}/#{files[0]}")
      else
        Zip::File.open(zipfile_name, create: true) do |zipfile|
          files.each do |f|
            zipfile.add(f, File.join(Rails.root.join('tmp').to_s, f))
          end
        end
        File.open("#{Rails.root.join('tmp')}/#{filename}.zip", 'r') do |f|
          send_data f.read, type: 'application/zip', filename: "#{filename}.zip"
        end
        File.delete("#{Rails.root.join('tmp')}/#{filename}.zip")
      end

    end
  end

  def visualize
    set_static_generator_params
    if params[:regenerate]
      populate_generator
      if turbo_frame_request?
        render :async_visualize
      else
        # if 
        redirect_to "/nanobot/#{@generator.id}/visualize"
      end
    else
      set_dynamic_generator_params
    end
    download if params[:type]
  end

  def user_visualize
    @host_user = params[:user]
    if @current_user.nil?
      if User.find_by(username: @host_user) && @generator.public
        set_generator_params
        render :visualize
        return
      else
        render :template => "errors/404"
        return
      end
    else
      if @current_user.username != @host_user
        if !@generator.public
          render :template => "errors/404"
          return
        else
          set_generator_params
          redirect_to "/nanobot/#{@generator.id}/visualize" 
          return
        end
      else
        set_generator_params
        render :visualize
        return
      end
    end
  end

  def async_visualize
    @color_palettes = Generator.color_palettes
    @supported_files = Generator.supported_files
    populate_generator
    render :async_visualize
  end

  def set_generator_params
    set_static_generator_params
    set_dynamic_generator_params
  end

  def set_static_generator_params
    @color_palettes = Generator.color_palettes
    @supported_files = Generator.supported_files
  end

  def set_dynamic_generator_params
    @positions = @generator.positions
    @colors = @generator.colors
    @vertex_cuts = @generator.vertex_cuts
    @scaffold = @generator.scaffold
    @staples = @generator.staples
    @start = @generator.routing['start']
    @end = @generator.routing['end']
  end

  def populate_generator
    graph = @generator.route
    routing = graph.to_hash
    @positions = graph.points
    @colors = graph.colors
    @scaffold = @generator.scaffold
    @vertex_cuts = graph.vertex_cuts.size
    @staples = graph.staples_hash
    @start = routing['start']
    @end = routing['end']
    Generator.find(@generator.id).update(
      routing: routing,
      positions: @positions,
      colors: @colors,
      vertex_cuts: @vertex_cuts,
      staples: @staples
    )
  end

  def update_generator
    if params[:visibility]
      Generator.find(@generator.id).update(public: !@generator.public)
    end

    if params[:bridge_length] && !@generator.is_current_bridge_length(params[:bridge_length])
      new_staples = @generator.update_bridge_length
      Generator.find(@generator.id).update(staples: new_staples)
    end

    if params[:color_palette] && !@generator.is_current_color_palette(params[:color_palette])
      graph_json = @generator.update_color_pallette
      Generator.find(@generator.id).update(routing: graph_json)
    end

    redirect_to "/nanobot/#{@generator.id}/visualize"
  end

  def compile
    redirect_to '/' if logged_in?
  end

  def create
    generator_fields = generator_params
    if !Generator.supported_shapes.include?(generator_fields[:shape])
      flash[:danger] = "#{generator_fields[:shape]} is currently not supported."
      redirect_to '/nanobot'
    else

      dimensions = { height: generator_fields[:height], width: generator_fields[:width],
                     depth: generator_fields[:depth], divisions: generator_fields[:divisions],
                     type: "Generator"}
      if Generator.scaffolds[generator_fields[:scaffold_name].to_sym].nil?

      else
        scaffold = Generator.public_send(generator_fields[:scaffold_name].parameterize(separator: '_'))
      end
      is_public = generator_fields[:visibility] == "1" ? true : false
      @generator = Generator.new({ shape: generator_fields[:shape], dimensions: dimensions, scaffold: scaffold,
                                   scaffold_name: generator_fields[:scaffold_name], public: is_public })
      @generator.user_id = @current_user.id unless @current_user.nil?

      if @generator.save
        session['id'] = @generator.id
        redirect_to "/nanobot/#{@generator.id}/visualize"
      else
        flash[:message] = 'Could Not Complete Request'
        redirect_to '/nanobot'
      end
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

  def write_staples_to_s3(staples, staple_colors)
    user_dir = if @current_user.nil?
                 'anon'
               else
                 @current_user.username
               end
    filename = "#{@generator.width}x#{@generator.height}x#{@generator.depth}-#{@generator.divisions}-#{Time.now}"
    # file_path = "#{user_dir}/#{filename}"
    file = File.open("#{Rails.root.join('tmp')}/#{filename}.csv", 'w')
    # file = File.open("app/assets/temp/#{filename}.csv", 'w')
    file.write('name,sequence,length')
    file.write("\n")
    staples.each_with_index do |staple, idx|
      staple_color = staple_colors[idx]
      file.write("#{staple.name},#{staple.sequence},#{staple.sequence.size}")
      file.write("\n")
    end
    file.close
    @generator.staples_csv.attach(
      io: File.open("#{Rails.root.join('tmp')}/#{filename}.csv"),
      filename: "#{filename}.csv",
      content_type: 'text/csv'
    )
  end

  private

  def generator_params
    params.require(:generator).permit(:height, :width, :depth, :shape, :divisions, :scaffold_name, :visibility)
  end

  def user_generator_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password, :generator)
  end
end
