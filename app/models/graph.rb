class Graph 
    attr_accessor :vertices, :edges, :route
    
    def initialize(segments)
        # each segment gets 4 sides 
        @segments = segments       
        @vertices = create_vertices
        plane = find_plane_routing
        @edges, @sets = plane[0], plane[1]
        planes = plane_rotations(plane)
        @route = find_plane_combination(planes) 
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
        edges = []
        i = 0
        while !connected(sets) && !full(sets)
             
            s1 = sets[i]
            s2 = sets[i+1]
            if !s1.singelton && !s2.singelton
                sets[i] = mergeSets(s1, s2)
                sets.delete(s2)
                i += 1
            elsif !s1.singelton

            else

            end

            # add remove vertices to sets as neccessary
        end
        outgoers = (@segments - 1) * 4
        loopers = loopers(sets)

        if loop_set_num(sets) >= outgoers / 2
            for i in 0..(loopers.length - 1)
                for j in 0..(loopers.length - 1)
                    if share_singelton(loopers[i], loopers[j]) && i != j
                        # implement adding or pruning edges
                        s = merge_loop_sets(loopers[i], loopers[j])
                        sets.delete(loopers[i])
                        sets.delete(loopers[j])
                        sets.append(s)
                    end
                end
            end
        end
        # implement a while loop if the number of looper is still greater than half of ourgoers
        [edges, sets]
    end

    def initialize_sets
        sets = []
        @vertices.each do |v|
            set = nil
            if (v.x % @segments == 0 || v.y % @segments == 0)
                set = Set.new(v, false)
            else
                set = Set.new(v, true)
            end
            sets.push(set)
        end
        sets
    end

    def connected(sets)
        sets.each do |set|
            if !set.singelton && set.vertices.length < 2
                return false
            end
        end
        return true
    end


    def full(sets)
        sets = singeltons(sets)
        sets.each do |s|
            if s.length < 2
                return false
            end
        end
        return true
    end



    def singeltons(sets)
        s = []
        sets.each do |set|
            if set.singelton
                s.append(set)
            end
        end
        s
    end

    def loopers(sets)
        s = []
        sets.each do |set|
            if set.is_loop_set?
                s.append(set)
            end
        end
        s
    end

    def merge_sets(s1, s2)


    end


    def merge_loop_sets(s1, s2, share)
        if share

        else

        end

    end

    def loop_set_num(sets)
        count = 0
        sets.each do |s|
            if s.is_loop_set?
                count += 1
            end
        end
    end

    def 

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
        attr_accessor :vertices, :singelton, :edges

        def initialize(vertex, singelton)
            @vertices = [vertex]
            @singelton = singelton
            @edges = []
            # *vertices.each do |v|
            #     @vertices.push(v)
            # end
        end

        def add_node(vertex)
            @vertices.append(vertex)
        end

        def add_edge(edge)
            @edges.append(edge)
        end

        def is_loop_set?
            @edges.length == 2 
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