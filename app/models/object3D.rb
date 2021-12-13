# frozen_string_literal: true

class Object3D
  attr_accessor :height, :width, :depth, :segments, :leftover

  def initialize(ht, wt, dt, s, l)
    @height = ht
    @width = wt
    @depth = dt
    @segments = s
    @leftover = l.floor
  end
end
