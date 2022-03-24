# frozen_string_literal: true

class CatmullRomCurve3 < Curve
  def generate(divisions)
    curve_points = []
    divisions_per_edge = (divisions / @points.size).floor == 0 ? 2 : (divisions / @points.size).floor
    @points.size.times do |i|
        p0, p1, p2, p3 = adjacent_points(i)
        alpha = 0.5

        t0 = 0
        t1 = tj(t0, p0, p1, alpha)
        t2 = tj(t1, p1, p2, alpha)
        t3 = tj(t2, p2, p3, alpha)
        divisions_per_edge = i == @points.size - 1 ? divisions % divisions_per_edge + divisions_per_edge : divisions_per_edge
        t = linspace(t1, t2, divisions_per_edge)
        t.each do |d|
            a1 = p0 * (t1 - d) / (t1 - t0) + p1 * (d - t0) / (t1 - t0)
            a2 = p1 * (t2 - d) / (t2 - t1) + p2 * (d - t1) / (t2 - t1)
            a3 = p2 * (t3 - d) / (t3 - t2) + p3 * (d - t2) / (t3 - t2)

            b1 = a1 * (t2 - d) / (t2 - t0) + a2 * (d - t0) / (t2 - t0)
            b2 = a2 * (t3 - d) / (t3 - t1) + a3 * (d - t1) / (t3 - t1)

            c = b1 * (t2 - d) / (t2 - t1) + b2 * (d - t1) / (t2 - t1)
            curve_points << c
        end
    end

    curve_points
  end

  def tj(ti, pi, pj, alpha)
    pi.distance_to_squared(pj)**alpha + ti
  end

  def linspace(low, high, num)
    [*0..(num - 1)].collect { |i| low + i.to_f * (high - low) / (num - 1) }
  end

  def adjacent_points(idx)
    [
      @points[(idx - 1) % @points.size],
      @points[idx % @points.size],
      @points[(idx + 1) % @points.size],
      @points[(idx + 2) % @points.size]
    ]
  end

  def interpolate(u, p0, p1, p2, p3)
    u2 = u * u
    u3 = u2 * u

    f1 = u3 * -0.5 + u2 - 0.5 * u
    f2 = u3 * 1.5 - u2 * 2.5 + 1.0
    f3 = u3 * -1.5 + u2 * 2.0 + 0.5 * u
    f4 = u3 * 0.5 + u2 * -0.5

    p0 * f1 + p1 * f2 + p2 * f3 + p3 * f4

  end
end
