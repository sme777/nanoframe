
class Curve
    def initialize(points, closed=false, tension=0.5, dim=3)
        @closed = closed
        @tension = tension
        @points = []
        counter = 0
        while counter < points.size
            point = Vertex.new(points[counter], 
                                points[counter + 1], 
                                points[counter + 2])
            @points << point     
            counter += dim
        end
    end
end