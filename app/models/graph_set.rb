# frozen_string_literal: true

require 'json'

class GraphSet
  attr_accessor :v, :singelton, :e

  def initialize(vertex, singelton = false)
    @v = [vertex]
    @singelton = singelton
    @e = []
  end

  def add_node(vertex)
    @v.append(vertex)
  end

  def add_edge(edge)
    @e.append(edge)
  end

  def is_loop_set?
    @e.length == 2
  end

  def string
    res = '{'
    @v.each do |v|
      res += v.string
      res += ', ' if v != @v.last
    end
    res += '}'
  end

  def sort_edges
    last_vertex = @v.first
    sorted_edges = []
    while sorted_edges != @e.length
      e = find_edge_starting_with(last_vertex)
      sort_edges.append(e)
      last_vertex = e.v2
    end
    sort_edges
  end

  def find_edge_starting_with(v)
    @e.each do |edge|
      return edge if edge.v1 == v
    end
  end

  def to_hash
    hash = { "vertices": @v, "edges": sort_edges, "singelton": singelton }
  end

  def to_json(*_args)
    JSON.generate(to_hash)
  end

  def self.string_of_sets(sets)
    res = '('
    sets.each do |s|
      res += s.string
      res += ', ' unless s == sets.last
    end
    res += ')'
  end
end
