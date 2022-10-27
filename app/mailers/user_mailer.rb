class UserMailer < ApplicationMailer

    def welcome_email(user)
        @user = user
        mail(to: @user.email, subject: "Welcome to NanoFrame!")
    end

    def forgot_password(user, password_reset_code)
        @user = user
        @password_reset_code = password_reset_code
        mail(to: @user.email, subject: "Reset Password for NanoFrame.")
    end
end
