# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :current_user
  helper_method :current_user
  helper_method :logged_in?
  helper_method :not_logged_in?

  def current_user
    return unless session[:user_id]

    @current_user ||= User.find(session[:user_id])
  end

  def logged_in?
    !!session[:user_id]
  end

  def set_generator
    @generator = Generator.find_by(id: generator_id) || Generator.new
  end
  
  def set_user
    @current_user = User.find_by(id: session[:user_id]) unless session[:user_id].nil?
  end

  def is_active_generator?
    session[:id]
  end

  def generator_id
    params[:id] || session[:id]
  end
end
