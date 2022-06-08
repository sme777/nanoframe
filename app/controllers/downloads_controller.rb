# frozen_string_literal: true
require 'zip'

class DownloadsController < ApplicationController
  before_action :set_generator

  def self.define_download(type)
    define_method("download_#{type}") do
      # json_obj = JSON.parse(@generator.json)
      # scaffold_sequence = json_obj['sequence']
      # scaffold_coordinates = json_obj['positions']
      # staple_sequence = json_obj['sSequence']
      # staple_coordinates = json_obj['sPositions']
      # @generator.scaffold(scaffold_sequence, scaffold_coordinates)
      # @generator.staples(staple_sequence, staple_coordinates)
      files = @generator.send(type.to_s, @generator.positions, @generator.scaffold, @generator.staples, "test")
      # file = File.open("app/assets/results/test.#{type}")
      # files.each do |filename|
      # FileUtils.mkdir_p()
      zipfile_name = "#{Rails.root.join('tmp').to_s}/test.zip"
      if files.size == 1

      else
        Zip::File.open(zipfile_name, create: true) do |zipfile|
          files.each do |filename|
            zipfile.add(filename, File.join(Rails.root.join('tmp').to_s, filename))
          end
        end
      end
      send_data("#{Rails.root.join('tmp').to_s}/test.zip")
      redirect_to "/nanobot/#{@generator.id}/routing"
    end
  end

  define_download :pdb
  define_download :oxdna
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
