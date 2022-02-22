# frozen_string_literal: true

class User < ApplicationRecord
  # validations
  validates :username, presence: true, uniqueness: true
  has_secure_password
  # associations
  has_many :generators
end
