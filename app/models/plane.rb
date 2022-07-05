# frozen_string_literal: true

class Plane
  attr_accessor :graph, :up, :down, :left, :right, :name

  def initialize(plane_sets, graph, name)
    @name = name
    @plane_sets = plane_sets
    @graph = graph
  end

  def to_hash
    sets_arr = []
    @plane_sets.each do |set|
      edges_arr = []
      set.e.each do |edge|
        edges_arr.append(edge.to_hash)
      end
      set_hash = { edges: edges_arr }
      sets_arr.append(set_hash)
    end
    { "sets": sets_arr }
  end

  def self.orthogonal_dimension(v1, v2)
    case @graph.shape
    when :cube
      side = Routing.find_plane_number(v1, v2, [@graph.width, @graph.height, @graph.depth])
      if (v1.x - v2.x).zero? && (v1.x.zero? || v1.x.abs == @graph.width)
        [:x, side]
      elsif (v1.y - v2.y).zero? && (v1.y.zero? || v1.y.abs == @graph.height)
        [:y, side]
      elsif (v1.z - v2.z).zero? && (v1.z.zero? || v1.z.abs == @graph.depth)
        [:z, side]
      end
    end
  end
end
