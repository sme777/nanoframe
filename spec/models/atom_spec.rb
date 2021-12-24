# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Atom, type: :model do
  describe 'entity for nucleotide and chemical element' do
    it 'sucessfully creates an Atom object' do
      atom = Atom.new('A', 'H')
      atom.should_not be_nil
    end

    it 'should contain Cartesian coordinates' do
      atom = Atom.new('T', 'O')
      atom.x = 0
      atom.y = 2
      atom.z = 1
      expect(atom.x).to equal(0)
      expect(atom.y).to equal(2)
      expect(atom.z).to equal(1)
    end
  end
end
