# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Atom, type: :model do
  describe 'entity for nucleotide and chemical element' do
    it 'sucessfully creates a nucleotide object' do
      nt = Atom.new('A', 'H')
      nt.should_not be_nil
    end

    it 'should contain Cartesian coordinates' do
      nt = Atom.new('T', 'O')
      nt.x = 0
      nt.y = 2
      nt.z = 1
      expect(nt.x).to equal(0)
      expect(nt.y).to equal(2)
      expect(nt.z).to equal(1)
    end
  end
end
