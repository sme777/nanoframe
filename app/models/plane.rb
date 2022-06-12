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
end
