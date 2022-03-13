# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe User, type: :model do
  it 'creates a regular User' do
    user = User.create!(name: 'user1', email: 'user1_email@example.com',
                        username: 'rdx67', password: 'password123')
    allow(user).to receive(:email) { 'email1@example.com' }
    expect(user.email).to eq('email1@example.com')
  end
end
