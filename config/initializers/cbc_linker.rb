# frozen_string_literal: true

if Rails.env.production? || Rails.env.staging?
  ENV['GDAL_DATA'] = '.apt/usr/share/gdal/2.1'
  # heroku-buildpack-apt does not run postinstall scripts
  ENV['LD_LIBRARY_PATH'] = ".apt/usr/lib/libblas:.apt/usr/lib/lapack:#{ENV['LD_LIBRARY_PATH']}"
end
