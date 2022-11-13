# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Routing', type: :model do
  # it 'connects segmented vertices together' do
  #     shape = Shape.new(:cube)
  #     outgoer_vertices, corners = shape.faces[0].generate_segmented_vertices(5)
  #     connected_edges = Routing.connect_vertices(outgoer_vertices, corners)
  # end

  # it 'find optimal edges for a tetrahedron' do
  #   shape = Shape.new(:tetrahedron)
  #   outgoers, corners = [], []
  #   e, v = [], []
  #   shape.faces.each do |face|
  #     result = face.generate_segmented_vertices(5)
  #     outgoers << result[0]
  #     corners << result[1]
  #   end

  #   outgoers.each_with_index do |outgoer_group, idx|
  #     edges = Routing.find_optimal_edges(outgoer_group, corners[idx])
  #     vertices = Routing.get_vertices(edges)
  #     e << edges
  #     v << vertices
  #   end

  # end

  it 'finds optimal edges for a cube' do
    shape = Shape.new(:cube)
    outgoer_vertices, corners = shape.faces[0].generate_segmented_vertices(3)
    # byebug
    optimal_edges, failures = Routing.find_optimal_edges(outgoer_vertices, corners)
    # byebug
    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(3.849, 6.667, 1.361) &&
    #                  edge.v2 == Vertex.new(0, 6.667, 4.082)) || (edge.v2 == Vertex.new(3.849, 6.667, 1.361) &&
    #                  edge.v1 == Vertex.new(0, 6.667, 4.082))
    #        end).to_not be_nil

    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(0, 6.667, 4.082) &&
    #                  edge.v2 == Vertex.new(-3.849, 6.667, 6.804)) || (edge.v2 == Vertex.new(0, 6.667, 4.082) &&
    #                  edge.v1 == Vertex.new(-3.849, 6.667, 6.804))
    #        end).to_not be_nil

    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(0, 6.667, 4.082) &&
    #                  edge.v2 == Vertex.new(-1.925, 10.0, 1.361)) || (edge.v2 == Vertex.new(0, 6.667, 4.082) &&
    #                  edge.v1 == Vertex.new(-1.925, 10.0, 1.361))
    #        end).to_not be_nil

    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(7.698, 0, 6.804) &&
    #                  edge.v2 == Vertex.new(5.774, 3.333, 4.082)) || (edge.v2 == Vertex.new(7.698, 0, 6.804) &&
    #                  edge.v1 == Vertex.new(5.774, 3.333, 4.082))
    #        end).to_not be_nil

    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(5.774, 3.333, 4.082) &&
    #                  edge.v2 == Vertex.new(3.849, 6.667, 1.361)) || (edge.v2 == Vertex.new(5.774, 3.333, 4.082) &&
    #                  edge.v1 == Vertex.new(3.849, 6.667, 1.361))
    #        end).to_not be_nil

    # expect(optimal_edges.find do |edge|
    #          (edge.v1 == Vertex.new(9.623, 3.333, 1.361) &&
    #                  edge.v2 == Vertex.new(5.774, 3.333, 4.082)) || (edge.v2 == Vertex.new(9.623, 3.333, 1.361) &&
    #                  edge.v1 == Vertex.new(5.774, 3.333, 4.082))
    #        end).to_not be_nil
    # optimal_vertices = Routing.get_vertices(optimal_edges)
  end

  it 'find optimal edges for tetrahedron' do
    shape = Shape.new(:cube)
    segments = 5
    byebug
    outgoers, corners, edges, vertices = [], [], [], []
    shape.faces.each do |face|
      outgoer, corner = face.generate_segmented_vertices(segments)
      outgoers << outgoer
      corners << corner
    end
    outgoers.each_with_index do |outgoer_group, idx|
      group_edges = Routing.find_optimal_edges(outgoer_group, corners[idx])
      group_vertices = Routing.get_vertices(group_edges)
      edges << group_edges
      vertices << group_vertices
    end
  end

  it 'find plane equations' do
    a, b, c, d = Routing.get_plane_equation(
      Vertex.new(3, 0, 3),
      Vertex.new(6, 0, 0),
      Vertex.new(6, 3, 6)
    )
    expect(a).to eq(9)
    expect(b).to eq(-18)
    expect(c).to eq(9)
    expect(d).to eq(-54)
  end
end
