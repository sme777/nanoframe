# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.3'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'rails', '~> 6.1.3'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.1'
# Use Puma as the app server
gem 'puma', '~> 5.0'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker'#, '~> 5.0'

gem 'hotwire-rails'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
gem 'dotenv-rails'
# Use Active Model has_secure_password
gem 'bcrypt', '~> 3.1.7'
# Use third party sign on authenticate users
gem 'omniauth', '~> 2.0'
gem 'omniauth-github', '~> 2.0.0'
gem 'omniauth-google-oauth2'
gem 'omniauth-twitter2'
gem 'omniauth-rails_csrf_protection'
# Paginating Active Record
gem 'kaminari'
gem 'pycall'
gem 'will_paginate'
# User Active Storage variant
gem 'mini_magick', '~>4.8'
# User AWS sdk
gem 'aws-sdk-s3', require: false
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
gem 'inline_svg'
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false
# File zipper
gem 'erb_lint', require: false
gem 'rubyzip'

gem 'spicy-proton'
# Loggers
gem 'delaunator'
gem 'oink'
gem 'ruby-cbc', require: false
gem 'unicorn'
# gem 'rack-timeout'
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'cucumber-rails', require: false
  gem 'jasmine'
  gem 'rspec-rails', '~> 5.0.0'
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
  gem 'simplecov', '~> 0.17.0', require: false
  # database_cleaner is not required, but highly recommended
  gem 'database_cleaner'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 4.1.0'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'listen', '~> 3.3'
  gem 'rack-mini-profiler', '~> 2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'guard-livereload', '~> 2.5', require: false
  gem 'rack-livereload'
  gem 'spring'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

group :tools do
  gem 'capistrano'
  gem 'squasher', '>= 0.6.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
