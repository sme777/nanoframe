# frozen_string_literal: true

class Curve
  def initialize(points, ends_connect = true)
    @points = points
    @ends_connect = ends_connect
  end
end
