# frozen_string_literal: true
require 'spicy-proton'

class User < ApplicationRecord
  # validations
  validates :username, presence: true, uniqueness: true
  validates :password, presence: true, length: {in: 8..128}, if: :password_validation
  has_secure_password
  # associations
  has_many :generators
  has_many :comments

  def generate_password_reset_code
    update!(reset_password_token: generate_token, 
      reset_password_sent_at: Time.now.utc, 
      reset_password_verified: false,
      )
    reset_password_token
  end

  def password_validation
    new_record? || password_digest_changed?
  end
  

  def self.generate_username
    Spicy::Proton.pair
  end

  private

  def generate_token
    SecureRandom.hex(10)
  end
end
