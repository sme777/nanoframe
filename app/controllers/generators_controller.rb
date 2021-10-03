require 'json'

class GeneratorsController < ApplicationController
  before_action :set_generator, except: [:create]

  def index
    # byebug
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
    byebug
    @generator.route
    @generator.scaffold(sequence, coordinates)
    @generator.feedback_control(coordinates)
    session[:filename] = @generator.pdb

    render :synthesize
  end

  def routing
    render :routing
  end

  def results
    render :results
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

  def create
    @generator = Generator.new(generator_params)
    # byebug

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
                                      :height_segment, :tube_radius, :tubular_radius, :p, :q, :scaffold_length, :shape, :json)
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
    # byebug
    session[:id]
  end

  def generator_id
    params[:id] || session[:id]
  end
end
