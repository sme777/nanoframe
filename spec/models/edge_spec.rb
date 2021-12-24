# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Edge, type: :model do
  describe 'connecting two vertices undirectionally' do
    it 'sucessfully creates an Edge object' do
      edge = Edge.new(double(Vertex), double(Vertex))
      edge.should_not be_nil
    end
  end
end
