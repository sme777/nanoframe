# frozen_string_literal: true

class Plane
  attr_accessor :graph, :up, :down, :left, :right, :name

  def initialize(graph, name)
    @name = name
    @graph = graph
    @up = nil
    @down = nil
    @left = nil
    @right = nil
  end

  def to_hash
    sets_arr = []
    @graph.each do |set|
      edges_arr = []
      set.e.each do |edge|
        edges_arr.append(edge.to_hash)
      end
      set_hash = { edges: edges_arr }
      sets_arr.append(set_hash)
    end
    { "sets": sets_arr }
  end

  # For simple cuboid when all planes are
  def self.orthogonal_dimension(v1, v2)
    side = Routing.find_plane_number(v1, v2, [50, 50, 50])
    if v1.x - v2.x == 0 && (v1.x == 0 || v1.x.abs == 50)
      [:x, side]
    elsif v1.y - v2.y == 0 && (v1.y == 0 || v1.y.abs == 50)
      [:y, side]
    elsif v1.z - v2.z == 0 && (v1.z == 0 || v1.z.abs == 50)
      [:z, side]
    end
  end

end
