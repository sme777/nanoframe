# frozen_string_literal: true

require 'json'

class Vertex
  attr_accessor :x, :y, :z

  def initialize(x=0, y=0, z=0)
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

  def ==(other)
    @x == other.x && @y == other.y && @z == other.z
  end

  def distance_to_squared(v)
    dx = @x - v.x
    dy = @y - v.y
    dz = @z - v.z

    dx**2 + dy**2 + dz**2
  end

  def dot(v)
    @x * v.x + @y * v.y + @z * v.z
  end

  # Euclidian distance from origin
  def distance
    Math.sqrt((@x ** 2) + (@y ** 2) + (@z ** 2))
  end

  def normalize
    ds = distance
    @x /= ds
    @y /= ds
    @z /= ds
    self
  end

  def angleTo(v)
    denom = Math.sqrt((distance ** 2) * (v.distance) **2)
    if denom == 0
      Math::PI / 2
    else
      theta = dot(v) / denom
      clamped = [-1, [1, theta].min].max
      Math.acos(clamped)
    end
  end

  def cross_vectors(v)
    ax, ay, az = @x, @y, @z

    @x = ay * v.z - az * v.y
    @y = az * v.x - ax * v.z
    @z = ax * v.y - ay * v.x

  end

  def apply_axis_angle(axis, angle)
    half_angle = angle / 2
    s = Math.sin(half_angle)

    qx = axis.x * s
    qy = axis.y * s
    qz = axis.z * s
    qw = Math.cos(half_angle)

    ix = qw * @x + qy * @z - qz * @y
    iy = qw * @y + qz * @x - qx * @z
    iz = qw * @z + qx * @y - qy * @x
    iw = -qx * @x - qy * @y - qz * @z

    @x = ix * qw + iw * -qx + iy * -qz - iz * -qy
    @y = iy * qw + iw * -qy + iz * -qx - ix * -qz
    @z = iz * qw + iw * -qz + ix * -qy - iy * -qx
  end

  def euler_angles
    [Math.atan2(@x, @y), Math.atan2(@y, Math.sqrt(@x**2 + @z**2)), Math.atan2(@z, Math.sqrt(@x**2 + @z**2))]
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

  def self.flatten(vertices)
    positions = []
    vertices.each do |v|
      positions << v.x
      positions << v.y
      positions << v.z
    end
    positions
  end

  def self.linspace(dr, samples, start_v, end_v)
    v = Vertex.new(0, 0, 0)
    [*0..(samples - 1)].collect do |i|
      v.instance_variable_set("@#{dr}", i.to_f)
      start_v + v * (end_v - start_v) / (samples.to_f - 1)
    end
  end

  def self.overload_operator(opr)
    define_method(opr) do |obj|
      if obj.instance_of?(Float) || obj.instance_of?(Integer)
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
  # overload_operator :abs
  # overload_operator :floor
  # overload_operator :ceil
end
