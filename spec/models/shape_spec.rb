# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Face', type: :api do
  it 'generates vertex combinations' do
    face = Shape::Face.new([1, 2, 3])
    face.sides[0].v1.should be(1)
    face.sides[0].v2.should be(2)
    face.sides[0].parent.should be(face)

    face.sides[1].v1.should be(2)
    face.sides[1].v2.should be(3)
    face.sides[1].parent.should be(face)

    face.sides[2].v1.should be(3)
    face.sides[2].v2.should be(1)
    face.sides[2].parent.should be(face)
  end
end

RSpec.describe 'Shape', type: :api do
    it 'generates correctly connected faces for augmented dodecahedron' do
        shape = Shape.new("tetrahedron")
        shape.plane_map[3].should equal(4)
    end
end