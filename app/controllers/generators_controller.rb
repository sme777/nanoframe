require 'json'

class GeneratorsController < ApplicationController
  before_action :set_generator, except: [:create]

  def index
    # @options = @generator.get_shapes
    @current_user = User.find_by(id: session[:user_id]) unless session[:user_id].nil?
  end

  def new
    # @generator = Generator.new
  end

  def shaper; end

  def synthesize
    # @generator = Generator.find(params[:id])
    json_obj = JSON.parse(@generator.json)
    sequence = json_obj['sequence']
    coordinates = json_obj['coordinates']
    
    @generator.scaffold(sequence, coordinates)
    @generator.route
    # @generator.feedback_control(coordinates)
    session[:filename] = @generator.pdb
    render :synthesize
  end

  def routing
    # @routing = @generator.route
    # @strands_set = false
    @vertices = params[:vertices] || Generator.find(generator_id).vertices
    if Generator.find(generator_id).vertices.nil?
      Generator.find(generator_id).update(vertices: @vertices)
    end
    # session[:sets] = @sets unless @sets.nil?
    @scaffold = Generator.m13_scaffold
    if @generator.to_json == nil
      flash[:danger] = "No routing found"
      redirect_to '/nanobot'
    # else
    #   render json: @generator.to_json
    end
  end

  def visualize
    @routing = @generator.route
  end


  def compile
    if logged_in?
      redirect_to '/'
    end
  end

  def download_staples
    staples = JSON.parse(params[:staples])
    descriptions = JSON.parse(params[:descriptions])
    filename = @generator.make_staples_file(staples, descriptions)
    file = File.open('app/assets/results/' + filename + '.csv')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.csv'
  end

  def download_pdb
    file = File.open('app/assets/results/' + session[:filename] + '.pdb')
    contents = file.read
    file.close
    send_data contents, filename: session[:filename] + '.pdb'
    # redirect_to '/nanobot/' + @generator.id.to_s
  end

  def download_oxdna
    filename = @generator.oxdna
    file = File.open('app/assets/results/' + filename + '.oxdna')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.oxdna'
  end

  def download_csv
    filename = @generator.csv
    file = File.open('app/assets/results/' + filename + '.csv')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.csv'
  end

  def download_fasta
    filename = @generator.fasta
    file = File.open('app/assets/results/' + filename + '.fasta')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.fasta'
  end

  def download_txt
    filename = @generator.txt
    file = File.open('app/assets/results/' + filename + '.txt')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.txt'
  end

  def download_cadnano
    filename = @generator.cadnano
    file = File.open('app/assets/results/' + filename + '.json')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.json'
  end

  def download_bundle
    # zip files
    filename = @generator.bundle
    files = File.open('app/assets/results/' + filename + '.zip')
    contents = file.read
    file.close
    send_data contents, filename: filename + '.zip'
    
  end

  def create
    
    @generator = Generator.new(generator_params)

    if @generator.save
      session['id'] = @generator.id
      redirect_to '/nanobot/' + @generator.id.to_s + '/visualize'
    else
      flash[:message] = "Could Not Complete Request"
      redirect_to "/nanobot"
    end
  end

  def generator
    @returned_results = false
    if (!params[:step_size].nil? && params[:step_size] != "" && !params[:loopout_length].nil? && params[:loopout_length] != "")

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

    name = first + ' ' + last

    email_first = user_generator_params[:email_first]
    email_last = user_generator_params[:email_last]

    email = email_first + '@' + email_last
    username = user_generator_params[:username]
    user = User.new({ name: name, username: username, email: email, password: user_params[:password] })
    user.add_generator(user_generator_params[:generator])
    if user.save
      session[:user_id] = user.id
      redirect_to '/'
    else
      flash[:register_and_save_errors] = user.errors.full_messages
      redirect_to '/nanobot/' + @generator.id.to_s + '/compile'
    end

  end

  private

  def generator_params
    params.require(:generator).permit(:height, :width, :depth, :option, :depth_segment,
                                      :radius, :radial_segment, :radius_top, :radius_bottom, :width_segment, :detail,
                                      :height_segment, :tube_radius, :tubular_radius, :p, :q, :scaffold_length, :shape, :json)
  end

  def user_generator_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password, :generator)
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
    session[:id]
  end

  def generator_id
    params[:id] || session[:id]
  end
end
