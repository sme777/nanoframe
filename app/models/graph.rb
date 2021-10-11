require 'json'

class Graph 
    attr_accessor :vertices, :edges, :sets, :route
    
    def initialize(segments)
        # each segment gets 4 sides 
        @segments = segments       
        @vertices = create_vertices
        @edges = []
        @sets = []
        # plane = find_plane_routing
        # @edges, @sets = plane[0], plane[1]
        @planes = plane_rotations([]) # should be plane
        # @route = find_plane_combination(planes) 
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
        singeltons = singeltons(sets)
        edges = []
        queue = []
        i = 0
        while !connected(sets) && !full(sets)
             
            while !singeltons.empty?
                if queue.empty?
                    queue.append(singeltons.first) 
                elsif queue.first.e > 1
                    queue.delete_at(0)
                    singeltons.delete_at(0)
                else             
                    
                end
            end 


            # if !s1.singelton && !s2.singelton
            #     sets[i] = merge_sets(s1, s2)
            #     sets.delete(s2)
            #     i += 1
            # elsif !s1.singelton

            # else

            # end

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
            if s.vertices.length < 2
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
        s2.v.each do |v|
            s1.add_node(v)
        end
        s1
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

    def plane_rotations(e)
        []
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

    def make_vertex(x, y)
        Vertex.new(x, y)
    end

    def make_set(v, singelton=false)
        Set.new(v, singelton)
    end

    def make_edge(v1, v2)
        Edge.new(v1, v2)
    end

    # Generates JSON file of the graph
    def to_json
        hash = {"segments": @segments, "lineSegments": 3, "vertices": [], "edges": [], "sets": [], "planes": @planes}
        vs, es, ss = [], [], []
        @vertices.each do |v|
            vs.append(v.to_hash)
        end

        @edges.each do |e|
            es.append(e.to_hash)
        end

        @sets.each do |s|
            ss.append(s.to_hash)
        end

        hash[:vertices] = vs
        hash[:edges] = es
        hash[:sets] = ss
        JSON.generate(hash)
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

        def to_hash
            {"x": @x, "y": @y}
        end

        def to_json
            JSON.generate({"x": @x, "y": @y})
        end

    end

    class Set
        attr_accessor :v, :singelton, :e

        def initialize(vertex, singelton)
            @v = [vertex]
            @singelton = singelton
            @e = []
            # *vertices.each do |v|
            #     @vertices.push(v)
            # end
        end

        def add_node(vertex)
            @v.append(vertex)
        end

        def add_edge(edge)
            @e.append(edge)
        end

        def is_loop_set?
            @e.length == 2 
        end

        def string
            res = "{"
            @v.each do |v|
                res += v.string
                if v != @v.last
                    res += ", "
                end
            end
            res += "}"
        end

        def to_hash
            hash = {"vertices": [], "edges": [], "singelton": singelton}
            vs, es = [], []
            @v.each do |v|
                vs.append(v.to_hash)
            end
            @e.each do |e|
                es.append(e.to_hash)
            end
            hash[:vertices] = vs
            hash[:edges] = es
            hash
        end

        def to_json
            JSON.generate(to_hash)
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

        def to_hash
            {"v1": @v1.to_hash, "v2": @v2.to_hash}
        end

        def to_json
            JSON.generate({"v1": @v1.to_hash, "v2": @v2.to_hash})
        end
    end
end