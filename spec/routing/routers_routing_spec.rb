require "rails_helper"

RSpec.describe RoutersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/routers").to route_to("routers#index")
    end

    it "routes to #new" do
      expect(get: "/routers/new").to route_to("routers#new")
    end

    it "routes to #show" do
      expect(get: "/routers/1").to route_to("routers#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/routers/1/edit").to route_to("routers#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "/routers").to route_to("routers#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/routers/1").to route_to("routers#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/routers/1").to route_to("routers#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/routers/1").to route_to("routers#destroy", id: "1")
    end
  end
end
