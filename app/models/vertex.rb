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

  def equals(v)
    return @x == v.x && @y == v.y && @z == v.z
  end

  def distance_to_squared(v)
    dx = @x - v.x
    dy = @y - v.y
    dz = @z - v.z

    dx ** 2 + dy ** 2 + dz ** 2
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


  def self.overload_operator(opr)
    define_method(opr) do |obj|
      if obj.class == Float
        Vertex.new((@x.send opr, obj.to_f), (@y.send opr, obj.to_f), (@z.send opr, obj.to_f))
      else
        Vertex.new((@x.send opr, obj.x.to_f), (@y.send opr, obj.y.to_f), (@z.send opr, obj.z.to_f))
      end
    end

  end

  overload_operator :+
  overload_operator :*
  overload_operator :-
  overload_operator :/

end
