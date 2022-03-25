# frozen_string_literal: true

class DownloadsController < ApplicationController
  before_action :set_generator

  def self.define_download(type)
    define_method("download_#{type}") do
      byebug
      json_obj = JSON.parse(@generator.json)
      # scaffold_sequence = json_obj['sequence']
      # scaffold_coordinates = json_obj['positions']
      staple_sequence = json_obj['sSequence']
      staple_coordinates = json_obj['sPositions']
      # @generator.scaffold(scaffold_sequence, scaffold_coordinates)
      @generator.staples(staple_sequence, staple_coordinates)
      filename = @generator.send(type.to_s, session[:filename])
      file = File.open("app/assets/results/#{filename}.#{type}")
      contents = file.read
      file.close
      send_data contents, filename: "#{filename}.#{type}"
    end
  end

  define_download :pdb
  define_download :oxview
  define_download :nfr
  define_download :csv
  define_download :fasta
  define_download :txt
  define_download :cadnano

  def download_staples
    staples = JSON.parse(params[:staples])
    descriptions = JSON.parse(params[:descriptions])
    filename = @generator.make_staples_file(staples, descriptions)
    file = File.open("app/assets/results/#{filename}.csv")
    contents = file.read
    file.close
    send_data contents, filename: "#{filename}.csv"
  end

  def download_bundle
    # zip files
    filename = @generator.bundle
    files = File.open("app/assets/results/#{filename}.zip")
    contents = file.read
    file.close
    send_data contents, filename: "#{filename}.zip"
  end
end
