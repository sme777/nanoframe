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
        byebug
        optimal_vertices = Routing.get_vertices(optimal_edges)
        
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