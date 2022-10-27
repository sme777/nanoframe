# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'noreply.nanoframe@gmail.com'
  layout 'mailer'
end
