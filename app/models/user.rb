# frozen_string_literal: true

class User < ApplicationRecord
  # validations
  validates :username, presence: true, uniqueness: true
  has_secure_password
  # associations
  has_many :generators
  has_many :comments

  def generate_password_token!
    self.reset_password_token = generate_token
    self.reset_password_sent_at = Time.now.utc
    save!
  end

  private

  def generate_token
    SecureRandom.hex(10)
  end
end
