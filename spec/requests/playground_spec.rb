require 'rails_helper'

RSpec.describe "Playgrounds", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/playground/index"
      expect(response).to have_http_status(:success)
    end
  end

end
