# frozen_string_literal: true

require 'json'
require 'will_paginate/array'

class GeneratorsController < ApplicationController
  before_action :set_generator, except: [:create]
  before_action :set_user
  skip_before_action :verify_authenticity_token

  def index
    @shapes = Generator.shapes
    @scaffolds = Generator.scaffolds
  end

  def new
    @shapes = Generator.shapes
    @scaffolds = Generator.scaffolds
    @color_palettes = Generator.color_palettes
  end

  def synthesizer
    @rest_params = ""
    @first_page = 1
    @current_page = params[:page].to_i || @first_page
    @sort_method = params[:sort_by]
    @rest_params += "sort_by=#{@sort_method}" if !!params[:sort_by]

    search_column, search_direction = sort_to_query(@sort_method || "synthed")

    if search_column.nil?
      redirect_to "/synthesizer/#{@current_page}" 
      return  
    end
    if params[:search]
      @search_term = params[:search]
      filtered_term = params[:search].downcase.gsub(/\s+/, "")
      @rest_params += "search=#{filtered_term}"
      searched_synths = Generator.all.select do |generator|  
        name_condition = generator.shape.downcase.include?(filtered_term)
        user_condition = generator.user_id.nil? ? false : User.find_by(id: generator.user_id).name.downcase.include?(filtered_term)
        if search_column == "user_id"
          !generator.user_id.nil? && (name_condition || user_condition)
        else
          name_condition || user_condition
        end
        
      end
      if searched_synths.empty?
        @feed_synths = []
        @last_page = 1
      else
        @feed_synths = searched_synths.sort_by(&:"#{search_column}")
        @feed_synths = @feed_synths.reverse if search_direction == "DESC"
        @last_page = (@feed_synths.size / 9.0).ceil
        @feed_synths = @feed_synths.paginate(page: @current_page, per_page: 9)
      end
        
    else
      @feed_synths = Generator.all
                              .order("#{search_column} #{search_direction}")
                              .paginate(page: @current_page, per_page: 9)
      @last_page = (Generator.all.size / 9.0).ceil
    
    end
    if @current_page < @first_page
      redirect_to "/synthesizer/#{@first_page}"
      return
    end

    if @current_page > @last_page && @last_page.positive?
      redirect_to "/synthesizer/#{@last_page}"
      return
    end
  end

  def sort_to_query(method)
    if method == "author"
      ["user_id", "DESC"]
    elsif method == "popularity"
      ["likes", "DESC"]
    elsif method == "synthed"
      ["created_at", "DESC"]
    end
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

  def clone
    @cloned_generator = Generator.create(@generator.attributes.except("id"))
    redirect_to "/synthesizer/#{@cloned_generator.id}/visualize"
  end

  def download
    type = params[:type]
    unless type.nil?
      repl = { '(' => '', ')' => '', ' ' => '_' }
      type = type.gsub(Regexp.union(repl.keys), repl).downcase
      filename = @generator.filename(logged_in?, session[:user_id])
      files = @generator.send(type.downcase, filename)
      zipfile_name = "#{Rails.root.join('tmp')}/#{filename}.zip"
      if files.size == 1
        mime_type = ''
        if type.include?('staple')
          mime_type = 'text/csv'
        elsif type.include?('nfr')
          mime_type = 'application/json'
        elsif type.include?('pdb')
          mime_type = 'chemical/pdb'
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
        redirect_to "/synthesizer/#{@generator.id}/visualize"
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
      else
        render template: 'errors/404'
      end
    elsif @current_user.username != @host_user
      if User.find_by(username: @host_user) && @generator.public
        set_generator_params
        render :visualize
      else
        render template: 'errors/404'
      end
    else
      set_generator_params
      render :visualize
    end
    nil
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
    @mw = @generator.mw
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
    @mw = @generator.compute_mw(@staples)
    @generator.update(
      routing: routing,
      positions: @positions,
      colors: @colors,
      vertex_cuts: @vertex_cuts,
      staples: @staples,
      mw: @mw
    )
  end

  def update_generator
    @generator.update(public: !@generator.public) if params[:visibility]
    bridge_length = params[:bridge_length].to_i unless params[:bridge_length].nil?
    color_palette = params[:color_palette]
    if (bridge_length.is_a?(Integer) && bridge_length >= 0) && !@generator.is_current_bridge_length(bridge_length)
      @generator.update(bridge_length: bridge_length)
      graph = @generator.update_bridge_length(params[:bridge_length])
      @generator.update(
        vertex_cuts: graph.vertex_cuts.size,
        staples: graph.staples_hash
      )
    end

    if Generator.color_palettes.include?(color_palette) && !@generator.is_current_color_palette(color_palette)
      colors = @generator.update_color_pallette(color_palette)
      @generator.update(colors: colors, color_palette: color_palette)
    end
    redirect_to "/synthesizer/#{@generator.id}/visualize"
  end

  def update_likes
    respond_to do |format|
      format.json {render json: {"hello": "bye"}}
    end
  end


  def edit_name
    render partial: "edit_name"
  end

  def update_name
    @generator.update(name: params[:name_content])
    render partial: "name"
  end

  def cancel_update_name
    render partial: "name"
  end

  def edit_description
    render partial: "edit_description"
  end

  def update_description
    @generator.update(description: params[:description_content])
    render partial: "description"
  end

  def cancel_update_description
    render partial: "description"
  end

  def compile
    redirect_to '/' if logged_in?
  end

  def create
    generator_fields = generator_params
    if !Generator.supported_shapes.include?(generator_fields[:shape])
      flash[:danger] = "#{generator_fields[:shape]} is currently not supported."
      redirect_to '/synthesizer/new'
    else

      dimensions = { height: generator_fields[:height], width: generator_fields[:width],
                     depth: generator_fields[:depth], divisions: generator_fields[:divisions],
                     type: 'Generator' }
      if Generator.scaffolds[generator_fields[:scaffold_name].to_sym].nil?

      else
        scaffold = Generator.public_send(generator_fields[:scaffold_name].parameterize(separator: '_'))
      end
      is_public = generator_fields[:visibility] == '1'
      exterior_extensions_arr = []
      interior_extensions_arr = []

      unless generator_fields[:exterior_extension_sequence].nil?
        exterior_extensions_arr = generator_fields[:exterior_extension_sequence].tempfile.read.split("\n")
      end

      unless generator_fields[:interior_extension_sequence].nil?
        interior_extensions_arr = generator_fields[:interior_extension_sequence].tempfile.read.split("\n")
      end
      @generator = Generator.new({ shape: generator_fields[:shape], dimensions: dimensions, scaffold: scaffold,
                                   scaffold_name: generator_fields[:scaffold_name], public: is_public,
                                   exterior_extension_length: generator_fields[:exterior_extensions].to_i,
                                   interior_extension_length: generator_fields[:interior_extensions].to_i,
                                   exterior_extension_bond_type: generator_fields[:exterior_bond_type],
                                   interior_extension_bond_type: generator_fields[:interior_bond_type],
                                   exterior_extensions: exterior_extensions_arr, interior_extensions: interior_extensions_arr,
                                   bridge_length: generator_fields[:bridge_length], color_palette: generator_fields[:color_palette],
                                   reflection_buffer_length: generator_fields[:reflection_buffer_length],
                                   edge_type: generator_fields[:edge_type] })
      @generator.user_id = @current_user.id unless @current_user.nil?

      if @generator.save
        session['id'] = @generator.id
        redirect_to "/synthesizer/#{@generator.id}/visualize"
      else
        flash[:message] = 'Could Not Complete Request'
        redirect_to '/synthesizer/new'
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
      redirect_to "/synthesizer/#{@generator.id}/compile"
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
    params.require(:generator).permit(:height, :width, :depth, :shape, :divisions, :scaffold_name, :visibility,
                                      :exterior_extensions, :exterior_bond_type, :interior_extensions, :interior_bond_type,
                                      :exterior_extension_sequence, :interior_extension_sequence, :bridge_length, :reflection_buffer_length,
                                      :color_palette, :edge_type)
  end

  def user_generator_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password, :generator)
  end
end
