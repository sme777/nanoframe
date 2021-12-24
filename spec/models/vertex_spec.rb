# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Vertex, type: :model do
  describe 'an object storing 3D Cartesian coordinates' do
    it 'sucessfully creates a Vertex object' do
      vertex = Vertex.new(0, 0, 0)
      vertex.should_not be_nil
    end
  end
end
