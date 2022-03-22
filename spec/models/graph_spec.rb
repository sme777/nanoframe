# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Ruby CBC', type: :api do
  describe 'staple breaking hierarchy' do
    it 'breaks even long extensions' do
        broken_staples = Graph.break_long_extension(178.0)
        expect(broken_staples).to eq([44, 45, 44, 45])
    end

    # it 'creates edges with staples' do 
    #     edges = Graph.generate_shape_edges([Vertex.new(0, 1, 0), Vertex.new(0, 1, 1), Vertex.new(0, 0, 1)], 30)
    # end

    # it 'creates adjacent edges' do
    #     v1 = Vertex.new(0, 1)
    #     v2 = Vertex.new(1, 1)
    #     v3 = Vertex.new(1, 2)
    #     v4 = Vertex.new(1, 0)
    #     v5 = Vertex.new(2, 1)

    #     e1 = Edge.new(v1, v2) 
    #     e2 = Edge.new(v2, v3)
    #     e3 = Edge.new(v4, v2)
    #     e4 = Edge.new(v2, v5)

    #     e1.next = e2
    #     e2.prev = e1
    #     e3.next = e4
    #     e4.prev = e3
    #     edges = Graph.update_adjacent_edges([e1, e2, e3, e4])
    #     byebug
    # end
  end
end
