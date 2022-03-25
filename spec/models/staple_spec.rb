# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Staple', type: :api do
  describe 'basic operations' do
    it 'creates a staple with no extensions' do
      v1 = Vertex.new(0, 1, 0)
      v2 = Vertex.new(1, 1, 0)
      v3 = Vertex.new(1, 0, 0)
      e1 = Edge.new(v1, v2)
      e2 = Edge.new(v2, v3)
      e1.sequence = 'A' * 30
      e2.sequence = 'C' * 30
      staple = Staple.new(e1, e2, 15, 15, 1)
      expect(staple.sequence[...15]).to eq('T' * 15)
      expect(staple.sequence[16...]).to eq('G' * 15)
    end

    it 'creates a staple with vertical extensions' do
      v1 = Vertex.new(0, 1, 0)
      v2 = Vertex.new(1, 1, 0)
      v3 = Vertex.new(1, 0, 0)
      e1 = Edge.new(v1, v2)
      e2 = Edge.new(v2, v3)
      e1.sequence = 'A' * 60
      e2.sequence = 'C' * 60
      staple1 = Staple.new(e1, e1, 15, 45)
      expect(staple1.sequence.size).to eq(30)
      expect(staple1.sequence[...15]).to eq('T' * 15)
      expect(staple1.sequence[15...]).to eq('T' * 15)
      staple2 = Staple.new(e1, e2, 45, 15, 1)
      expect(staple2.sequence.size).to eq(31)
      expect(staple2.sequence[...15]).to eq('T' * 15)
      expect(staple2.sequence[16...]).to eq('G' * 15)
    end
  end
end
