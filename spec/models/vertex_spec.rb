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

  describe 'performing arithemtic operations' do
    it 'should perform addition' do
      v1 = Vertex.new(1, 2, 3)
      v2 = Vertex.new(3, 2, 1)
      v3 = v1 + v2
      expect(v3.x).to eq(4)
      expect(v3.y).to eq(4)
      expect(v3.z).to eq(4)
    end

    it 'should perform subtraction' do
      v1 = Vertex.new(1, 2, 3)
      v2 = Vertex.new(3, 2, 1)
      v3 = v1 - v2
      expect(v3.x).to eq(-2)
      expect(v3.y).to eq(0)
      expect(v3.z).to eq(2)
    end

    it 'should perform multiplication' do
      v1 = Vertex.new(1, 2, 3)
      v2 = Vertex.new(3, 2, 1)
      v3 = v1 * v2
      expect(v3.x).to eq(3)
      expect(v3.y).to eq(4)
      expect(v3.z).to eq(3)
    end

    it 'should perform division' do
      v1 = Vertex.new(1, 2, 3)
      v2 = Vertex.new(3, 2, 1)
      v3 = v1 / v2
      expect(v3.x).to eq(1 / 3.to_f)
      expect(v3.y).to eq(1)
      expect(v3.z).to eq(3)
    end
  end
end
