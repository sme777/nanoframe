# frozen_string_literal: true

class UsersController < ApplicationController

  def index
    @current_user = User.find_by(id: session[:user_id]) unless session[:user_id].nil?
    @rest_params = ""
    unless @current_user.nil?
      @sort_method = params[:sort_by]
      @rest_params += "sort_by=#{@sort_method}" if !!params[:sort_by]
      search_column, search_direction = sort_to_query(@sort_method || "synthed")

      @first_page = 1
      @current_page = params[:page].to_i || @first_page
      @last_page = (@current_user.generators.size / 5.0).ceil
      if @current_page < @first_page
        redirect_to "/home/#{@first_page}"
        return
      end

      if @current_page > @last_page && @last_page.positive?
        redirect_to "/home/#{@last_page}"
        return
      end
      if search_column == "likes"
        @home_synths = Generator.left_joins(:likes)
                                .group(:id)
                                .order("COUNT(likes.id)")
      elsif search_column == "public" || search_column == "private"
        @home_synths = @current_user.generators.sort_by { |synth| (!!synth.public).to_i }
      else
        @home_synths = @current_user.generators.sort_by(&:"#{search_column}")
      end
      @home_synths = @home_synths.reverse if search_direction == "DESC"
      @home_synths = @home_synths.paginate(page: @current_page, per_page: 5) unless @home_synths.empty?
    end

    @supported_files = Generator.supported_files
  end

  def sort_to_query(method)
    if method == "public"
      ["public", "DESC"]
    elsif method == "private"
      ["private", "ASC"]
    elsif method == "popularity"
      ["likes", "DESC"]
    elsif method == "synthed"
      ["created_at", "DESC"]
    end
  end

  def profile
    if !session[:user_id].nil?
      @current_user = User.find_by(id: session[:user_id])
    else
      redirect_to '/'
    end
  end

  def create
    first = user_params[:first]
    last = user_params[:last]

    name = "#{first} #{last}"

    email_first = user_params[:email_first]
    email_last = user_params[:email_last]

    email = "#{email_first}@#{email_last}"
    username = user_params[:username]
    user = User.new({ name: name, username: username, email: email, password: user_params[:password] })
    if user.save
      session[:user_id] = user.id
      UserMailer.welcome_email(user).deliver_now
    else
      flash[:register_errors] = user.errors.full_messages
    end    
    redirect_to '/'
  end

  def sign_in
    user = User.find_by(username: login_params[:login_username])
    if user&.authenticate(login_params[:login_password])
      session[:user_id] = user.id
    else
      flash[:danger] = 'Invalid Login Credentials'
    end
    redirect_to '/'
  end

  def sign_out
    session[:user_id] = nil
    redirect_to '/'
  end

  def check_email
    @user = User.find_by_email(params[:email])
    respond_to do |format|
      format.json { render json: { email_exists: @user.present? } }
    end
  end

  def check_username
    @user = User.find_by_username(params[:username])
    respond_to do |format|
      format.json { render json: { username_exists: @user.present? } }
    end
  end

  def get_contact
    redirect_to '/'
  end

  def add_generator(g); end

  def filter_generators
    @supported_files = Generator.supported_files
    @generators = case params[:type]
                  when 'public'
                    @current_user.generators.order(created_at: :desc).filter(&:public)
                  when 'private'
                    @current_user.generators.order(created_at: :desc).filter { |g| !g.public }
                  else
                    @current_user.generators.order(created_at: :desc)
                  end
    # render :index
  end

  def forgot_password
    # if params[:email].blank?
    #   flash[:danger] = "Please input a valid email address."

    # end
  end

  def email_verification
      if params[:email].blank?
        flash[:danger] = "Please input a valid email address."
        redirect_to forgot_password_path
      else
        user = User.find_by(email: params[:email])
        if user.present?
          password_reset_code = user.generate_password_reset_code
          session[:password_reset_email] = params[:email]
          # pass
          UserMailer.forgot_password(user, password_reset_code).deliver_now
          redirect_to verify_authenticity_path
        else
          flash[:danger] = "No user is registered with provided email address."
          redirect_to forgot_password_path
        end
      end
  end

  def verify_authenticity
    
  end

  def submit_authenticity_code
    if params[:authentication_code].blank?
      flash[:danger] = "Invalid or expired authentication code!"
      redirect_to verify_authenticity_path
    else
      user = User.find_by(email: session[:password_reset_email])
      if user.present? && user.reset_password_token == params[:authentication_code] && with_5_minutes?(user.reset_password_sent_at)
        user.reset_password_verified = true
        user.save!
        redirect_to new_password_path
      else
        flash[:danger] = "Invalid or expired authentication code!"
        redirect_to verify_authenticity_path
      end
    end
  end

  def reset_password
    user = User.find_by(email: session[:password_reset_email])
    redirect_to verify_authenticity_path if user.nil? || !user.reset_password_verified
  end

  def update_password
    if params[:new_password] != params[:confirm_password]
      flash[:danger] = "Passwords do not match!"
      redirect_to new_password_path
    else
      user = User.find_by(email: session[:password_reset_email])
      if user.present? && user.reset_password_verified
        user.update(password: params[:new_password],
                    reset_password_token: "",
                    reset_password_sent_at: "",
                    reset_password_verified: "")
        if !user.valid?
          flash[:danger] = user.errors.full_messages.first
          redirect_to new_password_path
          return
        end
        session[:user_id] = user.id
        session[:password_reset_email] = nil
        redirect_to root_path
      else
        flash[:danger] = "Please verify authenticity first!"
        redirect_to verify_authenticity_path
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:first, :last, :username, :email_first, :email_last, :password)
  end

  def login_params
    params.require(:user).permit(:login_username, :login_password)
  end

  def with_5_minutes?(time)
    Time.now - time < 5 * 60
  end

  def dumb_hash(input)
    input.bytes.reduce(:+)
  end
end

class FalseClass; def to_i; 0 end end
class TrueClass; def to_i; 1 end end
