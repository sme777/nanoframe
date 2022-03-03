require 'rails_helper'
require 'json'

RSpec.describe Routing, type: :model do
    it 'finds the next appropriate set' do
        last_vertex = Vertex.new(5, 0, -2)
        next_vertex = Vertex.new(4, 0, -2)
        edge = Edge.new(last_vertex, next_vertex)
        set1 = GraphSet.new(last_vertex)
        set1.add_edge(edge)
        set2 = GraphSet.new(next_vertex)
        set2.add_edge(edge)
        
        result = Routing.find_next_set([set1, set2], last_vertex, [])
        expect(result).to be(set1)
    end

    it 'normalizes given vectors with respect to segments' do
        vectors = [Vertex.new(1, 2, 3), Vertex.new(4, 4, 4)]

        result = Routing.normalize(vectors, 2, 2, 2)
        expect([result[0].x, result[0].y, result[0].z]).to eq([2, 4, 6])
        expect([result[1].x, result[1].y, result[1].z]).to eq([8, 8, 8])
    end
end
