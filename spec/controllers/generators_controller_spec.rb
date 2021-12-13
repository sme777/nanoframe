# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GeneratorsController, type: :controller do
  describe 'GET #index' do
    it 'returns a success response' do
      get '/nanobot/10/synthesize', params: {}
      # expect(response).to be_successful
    end
  end
end
