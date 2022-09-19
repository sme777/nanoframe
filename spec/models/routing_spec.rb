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
        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(3.849, 6.667, 1.361) && 
            edge.v2 == Vertex.new(0, 6.667, 4.082)) || (edge.v2 == Vertex.new(3.849, 6.667, 1.361) && 
            edge.v1 == Vertex.new(0, 6.667, 4.082))}).to_not be_nil

        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(0, 6.667, 4.082) && 
            edge.v2 == Vertex.new(-3.849, 6.667, 6.804)) || (edge.v2 == Vertex.new(0, 6.667, 4.082) && 
            edge.v1 == Vertex.new(-3.849, 6.667, 6.804))}).to_not be_nil

        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(0, 6.667, 4.082) && 
            edge.v2 == Vertex.new(-1.925, 10.0, 1.361)) || (edge.v2 == Vertex.new(0, 6.667, 4.082) && 
            edge.v1 == Vertex.new(-1.925, 10.0, 1.361))}).to_not be_nil

        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(7.698, 0, 6.804) && 
            edge.v2 == Vertex.new(5.774, 3.333, 4.082)) || (edge.v2 == Vertex.new(7.698, 0, 6.804) && 
            edge.v1 == Vertex.new(5.774, 3.333, 4.082))}).to_not be_nil

        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(5.774, 3.333, 4.082) && 
            edge.v2 == Vertex.new(3.849, 6.667, 1.361)) || (edge.v2 == Vertex.new(5.774, 3.333, 4.082) && 
            edge.v1 == Vertex.new(3.849, 6.667, 1.361)) }).to_not be_nil

        expect(optimal_edges.find { |edge| (edge.v1 == Vertex.new(9.623, 3.333, 1.361) && 
            edge.v2 == Vertex.new(5.774, 3.333, 4.082)) || (edge.v2 == Vertex.new(9.623, 3.333, 1.361) && 
            edge.v1 == Vertex.new(5.774, 3.333, 4.082)) }).to_not be_nil
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