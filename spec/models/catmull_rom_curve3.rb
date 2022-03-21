# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Atom, type: :model do
  describe 'creating a new instance of CatmullRomCurve3' do
    it 'sucessfully creates a curve object' do
      crc = CatmullRomCurve3.new([1, 2, 3])
      crc.should_not be_nil
    end

    it 'should correctly give curve points' do
      crc = CatmullRomCurve3.new([Vertex.new(0, 5, 5), Vertex.new(10, 2, 2), Vertex.new(8, 4, 12)])
      points = crc.generate(2)
      expect(points.first.x).to eq(0)
      expect(points.first.y).to eq(5)
      expect(points.first.z).to eq(5)
    end
  end
end
