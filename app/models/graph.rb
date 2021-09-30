class Graph 
    attr_accessor :vertices, :edges, :route
    def initialize(segments)
        # each segment gets 4 sides 
        @segments = segments       
        @vertices = create_vertices
        @edges = find_plane_routing
        # arr = plane_rotations(@edges)
        @route = find_plane_combination(["a", "b", "c", "d"]) 
    end

    def create_vertices
        v = []
        x = 0
        y = 0
        # byebug
        while (x <= @segments && y <= @segments)

            if !(x % @segments == 0 && y % @segments == 0)
                v.push(Vertex.new(x, y))
            end
            y += 1

            if (y > @segments)
                y = 0
                x += 1
            end
            
        end
        v
    end


    def find_plane_routing
        sets = initialize_sets
    end

    def initialize_sets
        sets = []
        @vertices.each do |v|
            set = Set.new(v)
            sets.push(set)
        end
        sets
    end

    def connected(sets)
        sets.each do |set|
            vertices = set.vertices
            if (vertices.length < 2)
                v = vertices.first
                if !(v.x % @segments == 0 || v.y % @segments == 0)
                    return false
                end
            end
        end
        return true
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

    def string_of_sets(sets)
        res = "("
        sets.each do |s|
            res += s.string
            if !(s == sets.last)
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
        attr_accessor :vertices

        def initialize(vertex)
            @vertices = [vertex]
            
            # *vertices.each do |v|
            #     @vertices.push(v)
            # end
        end

        def string
            res = "{"
            @vertices.each do |v|
                res += v.string
            end
            res += "}"
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