class Graph 
    attr_accessor :vertices, :edges, :route
    def initialize(segments)
        # each segment gets 4 sides        
        @vertices = create_vertices(segments)
        @edges = find_plane_routing(@vertices)
        # arr = plane_rotations(@edges)
        @route = find_plane_combination(["a", "b", "c", "d"]) 
    end

    def create_vertices(s)
        v = []
        x = 0
        y = 0
        # byebug
        while (x <= s && y <= s)

            if !(x % s == 0 && y % s == 0)
                v.push(Vertex.new(x, y))
            end
            y += 1

            if (y > s)
                y = 0
                x += 1
            end
            
        end
        v
    end


    def find_plane_routing(v)

    end

    def plane_rotations(e)

    end

    def find_plane_combination(planes)
        combinations = planes.product(planes, planes, planes, planes, planes)
        combinations.each do |c|
            if has_one_loop(c)
                return c
            end
        end
        return nil
    end

    def has_one_loop(g)

    end

    def string_of_vertices
        res = "("
        @vertices.each do |v|
            
            res += v.string
            if !(v == @vertices.last)
                res += ", "
            end
        end
        res += ")"
    end

    def string_of_edges
        ""
    end

    class Vertex
        attr_accessor :x, :y

        def initialize(x, y)
            @x = x
            @y = y
        end

        def string
            "(#{@x}, #{@y})"
        end

    end

    class Set
        def initialize(*vertices)
            @s = add_vertices(*vertices)
        end
    end

    class Edge

        attr_accessor :v1, :v2

        def initialize(v1, v2)
            @v1 = v1
            @v2 = v2
        end

        def string
            "#{v1.string} -> #{v2.string}"
        end

    end
end