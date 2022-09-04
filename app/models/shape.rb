# frozen_string_literal: true

require 'json'

class Shape
  attr_accessor :name, :faces, :plane_map

  def initialize(name)
    @name = name
    @faces, @plane_map = generate_faces
  end

  def generate_faces
    data_hash = JSON.parse(
      File.read("#{Rails.root.join('app')}/assets/models/shapes.json")
    )
    shape_data = data_hash[@name.to_s]
    faces = []
    plane_map = {}
    shape_faces = shape_data['faces']
    shape_vertices = shape_data['vertices']
    shape_faces.each do |raw_face|
      plane_map[raw_face.size] = plane_map.key?(raw_face.size) ? plane_map[raw_face.size] + 1 : 1
      new_face = Face.new(raw_face, shape_vertices)
      faces.each do |face|
        ok, side1, side2 = new_face.shares_edge(face)
        if ok
          side1.neighbor = face
          side2.neighbor = new_face
        end
      end
      faces << new_face
    end
    [faces, plane_map]
  end

  def generate_plane_map; end

  class Face
    attr_accessor :sides

    def initialize(raw_face, vertices)
      @vertices = vertices
      @sides = generate_sides(raw_face)
    end

    def generate_sides(face)
      sides = []
      (0...face.size).each do |i|
        sides << Side.new(self, [@vertices[face[i]], @vertices[face[(i + 1) % face.size]]])
      end
      sides
    end

    def shares_edge(face)
      @sides.each do |side1|
        face.sides.each do |side2|
          if (side1.v1 == side2.v1 && side1.v2 == side2.v2) ||
             (side1.v1 == side2.v2 && side1.v2 == side2.v1)
            return [true, side1, side2]
          end
        end
      end
      [false, nil, nil]
    end

    def generate_segmented_vertices(segments)
      vertices = []
      @sides.each do |side|
        vertices << side.generate_vertices(segments)
      end
      vertices.flatten
    end
  end

  class Side
    attr_accessor :v1, :v2, :parent, :neighbor

    def initialize(parent, edge)
      @v1 = edge[0]
      @v2 = edge[1]
      @parent = parent
      @neighbor = nil
    end

    def generate_vertices(segments)
      vertices = []
      (segments + 1).times do |segment|
        vertices << Vertex.new(@v1[0] *  segment / segments + @v2[0] *  (segments - segment) / segments,
                               @v1[1] *  segment / segments + @v2[1] *  (segments - segment) / segments,
                               @v1[2] *  segment / segments + @v2[2] *  (segments - segment) / segments,
                               side = self.object_id)
      end
      vertices[1...-1]
    end
  end
end
