# frozen_string_literal: true

class ApplicationController < ActionController::Base
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
end
