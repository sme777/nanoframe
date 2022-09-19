# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Face', type: :api do
  before :all do
    CUBE_VERTICES = [
      [0.0, 0.0, 12.24745],
      [11.54701, 0.0, 4.082483],
      [-5.773503, 10.0, 4.082483],
      [-5.773503, -10.0, 4.082483],
      [5.773503, 10.0, -4.082483],
      [5.773503, -10.0, -4.082483],
      [-11.54701, 0.0, -4.082483],
      [0.0, 0.0, -12.24745]
  ]
  end

  it 'generates vertex combinations' do
    face = Shape::Face.new([1, 2, 3], CUBE_VERTICES)
    expect(face.sides[0].v1).to eq([11.54701, 0.0, 4.082483])
    expect(face.sides[0].v2).to eq([-5.773503, 10.0, 4.082483])
    face.sides[0].parent.should be(face)

    expect(face.sides[1].v1).to eq([-5.773503, 10.0, 4.082483])
    expect(face.sides[1].v2).to eq([-5.773503, -10.0, 4.082483])
    face.sides[1].parent.should be(face)

    expect(face.sides[2].v1).to eq([-5.773503, -10.0, 4.082483])
    expect(face.sides[2].v2).to eq([11.54701, 0.0, 4.082483])
    face.sides[2].parent.should be(face)
  end

  it 'generates segemnted vertices with corners' do 
    face  = Shape::Face.new([0, 1, 4, 2], CUBE_VERTICES)
    vertices, corners = face.generate_segmented_vertices(5)
    expect(vertices.size).to eq(16)
    expect(corners.size).to eq(4)
  end
end

RSpec.describe 'Shape', type: :api do
    it 'generates correctly connected faces for augmented dodecahedron' do
        shape = Shape.new("tetrahedron")
        shape.plane_map[3].should equal(4)
    end
end