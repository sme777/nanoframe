# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Routing', type: :model do

    # it 'connects segmented vertices together' do
    #     shape = Shape.new(:cube)
    #     outgoer_vertices, corners = shape.faces[0].generate_segmented_vertices(5)
    #     connected_edges = Routing.connect_vertices(outgoer_vertices, corners)
    # end

    it 'finds optimal edges for a cube' do
        shape = Shape.new(:cube)
        outgoer_vertices, corners = shape.faces[0].generate_segmented_vertices(3)
        # byebug
        optimal_edges, failures = Routing.find_optimal_edges(outgoer_vertices, corners)
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(3.84899, 6.666683, 1.36082), Vertex.new(7.698, 6.6667, -1.3608)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(3.84899, 6.666683, 1.36082), Vertex.new(1.9245, 10.0, -1.3608)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(3.849, 0.0, 9.5258), Vertex.new(1.9245, 3.3333, 6.804133)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        expect(optimal_edges).to include(Edge.new(Vertex.new(0, 6.666675, 4.082446), Vertex.new(3.84899, 6.666683, 1.36082)))
        # optimal_vertices = Routing.get_vertices(optimal_edges)
        
    end

    it 'find plane equations' do
        
        a,b,c,d = Routing.get_plane_equation(
            Vertex.new(3,0,3),
            Vertex.new(6,0,0),
            Vertex.new(6,3,6)
        )
        expect(a).to eq(9)
        expect(b).to eq(-18)
        expect(c).to eq(9)
        expect(d).to eq(-54)
    end
end