require 'rails_helper'

RSpec.describe Graph, type: :model do
  describe 'generates correct vertices' do
    it 'for 2 segment graph' do
        g = Graph.new(2)
        g.string_of_vertices.should eq("((0, 1), (1, 0), (1, 1), (1, 2), (2, 1))")
    end

    it 'for 5 segment graph' do
        g = Graph.new(5)
        g.string_of_vertices.should eq("((0, 1), (0, 2), (0, 3), (0, 4), (1, 0), (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), " + 
                                        "(2, 0), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (3, 0), (3, 1), (3, 2), (3, 3), " +
                                        "(3, 4), (3, 5), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (5, 1), (5, 2), (5, 3), (5, 4))")
    end
  end

  describe 'finds a valid routing' do
    it 'for 2 segment graph' do
        g = Graph.new(2)
        g.string_of_edges.should eq("((0, 1), (1, 0))->(1, 1), ((1, 2), (2, 1))->(1, 1)")
    end

    it 'for 3 segment graph' do

    end

    it 'for 5 segment graph' do

    end
  end
end
