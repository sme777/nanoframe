# frozen_string_literal: true

require 'json'

class Vertex
  attr_accessor :x, :y, :z

  def initialize(x, y, z = 0)
    @x = x
    @y = y
    @z = z
  end

  def string
    "(#{@x}, #{@y}, #{@z})"
  end

  def to_hash
    { "x": @x, "y": @y, "z": @z }
  end

  def to_json(*_args)
    JSON.generate({ "x": @x, "y": @y, "z": @z })
  end

  def hash
    "#{x}#{y}#{z}"
  end

  def self.string_of_vertices(vertices)
    res = '('
    vertices.each do |v|
      res += v.string
      res += ', ' unless v == vertices.last
    end
    res += ')'
  end

  def self.beautify_vertices(vertices)
    result = ''
    vertices.each do |v|
      result += "#{v.string}\n"
    end
    result
  end
end
