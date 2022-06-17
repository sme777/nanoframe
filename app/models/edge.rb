# frozen_string_literal: true

require 'json'

class Edge
  attr_accessor :v1, :v2, :sequence, :adjacent_edges, :next, :prev, :assoc_strands, :scaffold_idxs,
                :complementary_rotation_labels, :extendable, :extendable_staple

  def initialize(v1, v2)
    @v1 = v1
    @v2 = v2
    @adjacent_edges = []
    @assoc_strands = []
    @scaffold_idxs = []
    @complementary_rotation_labels = []
    @extendable = false
    @extendable_staple = nil
  end

  def string
    "#{v1.string} -> #{v2.string}"
  end

  def to_hash
    { "v1": @v1.to_hash, "v2": @v2.to_hash }
  end

  def to_json(*_args)
    JSON.generate({ "v1": @v1.to_hash, "v2": @v2.to_hash })
  end

  def directional_change
    if @v1.x - @v2.x != 0
      :x
    elsif @v1.y - @v2.y != 0
      :y
    else
      :z
    end
  end

  def directional_change_vec
    if @v1.x - @v2.x != 0
      [:x, @v1.x - @v2.x]
    elsif @v1.y - @v2.y != 0
      [:y, @v1.y - @v2.y]
    elsif @v1.z - @v2.z != 0
      [:z, @v1.z - @v2.z]
    end
  end

  def has_shared_vertex?(e)
    @v2 == e.v2 || @v2 == e.v1
  end

  def shared_vertex?(e)
    if @v2 == e.v2 || @v2 == e.v1
      @v2
    elsif @v1 == e.v2 || @v1 == e.v1
      @v1
    end
  end

  def self.find_edge(v1, v2, edges)
    edges.each do |e|
      if e.v1.x == v1.x && e.v1.y == v1.y && e.v1.z == v1.z && e.v2.x == v2.x && e.v2.y == v2.y && e.v2.z == v2.z
        return e
      end
    end
    nil
  end

  def self.to_vertices(edges)
    vertices = []
    edges.each_with_index do |edge, _idx|
      vertices << edge.v1 unless vertices.include?(edge.v1)

      vertices << edge.v2
    end
    vertices
  end

  def self.string_of_edges(_edges)
    ''
  end

  def self.beautify_edges(edges)
    result = ''
    edges.each do |e|
      result += "#{e.string}\n"
    end
    result
  end
end
