# frozen_string_literal: true

require 'json'

class Edge
  attr_accessor :v1, :v2, :sequence, :adjacent_edges, :next, :prev

  def initialize(v1, v2)
    @v1 = v1
    @v2 = v2
    @adjacent_edges = []
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

  def has_shared_edge?(e)
    @v1 == e.v1 || @v2 == e.v2
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
