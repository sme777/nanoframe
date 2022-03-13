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
      crc = CatmullRomCurve3.new([0, 5, 5, 10, 2, 2, 8, 4, 12, 7, 9, 5, 14, 0, 12])
      byebug
      points = crc.generate(2)

      puts points
    end
  end
end
