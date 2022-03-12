class CatmullRomCurve3 < Curve
    
    def generate(divisions)
        curve_points = []
         
        # @points.size.times do |i|
        #     p0, p1, p2, p3 = adjacent_points(i)
            l = @points.size
            temp = Vertex.new(0, 0, 0)
            divisions.times do |d|
                p = (l - (@closed ? 0 : 1)) * d
                int_point = p.floor
                weight = p - int_point

                if @closed
                    int_point += int_point > 0 ? 0 : ((int_point.abs / l).floor + 1) * l
                elsif weight == 0 && int_point == l - 1
                    int_point = l - 2
                    weight = 1
                end

                if @closed || int_point > 0
                    p0 = @points[(int_point - 1) % l]
                else
                    temp = @points[0] - @points[1] 
                    temp += @points[0]
                    p0 = temp
                end

                p1 = @points[int_point % l]
                p2 = @points[(int_point + 1) % l] 

                if @closed || int_point + 2 < l
                    p3 = @points[(int_point + 2) % l]
                else
                    temp = @points[l - 1] - @points[l - 2] 
                    temp += @points[l - 1]
                    p3 = temp
                end

                # p0, p1, p2, p3 = adjacent_points(d)
                
                pow = 0.25
                dt0 = p0.distance_to_squared(p1) ** pow
                dt1 = p1.distance_to_squared(p2) ** pow
                dt2 = p2.distance_to_squared(p3) ** pow

                px_c0, px_c1, px_c2, px_c3 = uniform_catmull_rom(p0.x, p1.x, p2.x, p3.x, @tension) #non_uniform_catmull_rom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2)
                py_c0, py_c1, py_c2, py_c3 = uniform_catmull_rom(p0.y, p1.y, p2.y, p3.y, @tension) #non_uniform_catmull_rom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2)
                pz_c0, pz_c1, pz_c2, pz_c3 = uniform_catmull_rom(p0.z, p1.z, p2.z, p3.z, @tension) #non_uniform_catmull_rom(p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2)


                px = calc(px_c0, px_c1, px_c2, px_c3, weight)
                py = calc(py_c0, py_c1, py_c2, py_c3, weight)
                pz = calc(pz_c0, pz_c1, pz_c2, pz_c3, weight)
                curve_points << Vertex.new(px, py, pz)
                # curve_points << interpolate( d / divisions.to_f, p0, p1, p2, p3)
            end

        # end
        curve_points
    end

    def uniform_catmull_rom(x0, x1, x2, x3, tension)
        re_init(x1, x2, tension * (x2 - x0), tension * (x3 - x1))
    end

    def non_uniform_catmull_rom(x0, x1, x2, x3, dt0, dt1, dt2)
        t1 = (x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1
        t2 = (x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2 

        t1 *= dt1;
        t2 *= dt1;
        re_init(x1, x2, t1, t2);

    end

    def re_init(x0, x1, t0, t1)
        c0 = x0
        c1 = t0
        c2 = -3 * x0 + 3 * x1 - 2 * t0 - t1
        c3 = 2 * x0 - 2 * x1 + t0 + t1
        [c0, c1, c2, c3]
    end

    def calc(c0, c1, c2, c3, t)
        t2 = t * t
        t3 = t2 * t
        c0 + c1 * t + c2 * t2 + c3 * t3
    end

    def linspace(low, high. num)
        [*0..(num -1)].collect { |i| low + i.to_f * (high - low) / (num-1)}
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

        f1 = u3 * (-0.5) + u2 - 0.5 * u
        f2 = u3 * 1.5  - u2 * 2.5 + 1.0
        f3 = u3 * (-1.5) + u2 * 2.0 + 0.5 * u
        f4 = u3 * 0.5 + u2 * (-0.5)
        
        interpolated_point = p0 * f1 + p1 * f2 + p2 * f3 + p3 * f4
        interpolated_point
        # p0.zip(p1, p2, p3).map do |x0, x1, x2, x3|
        #   x0 * f1 + x1 * f2 + x2 * f3 + x3 * f4
        # end
    end

end