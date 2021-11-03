require 'json'

class Graph 
    attr_accessor :vertices, :edges, :sets, :route, :planes
    
    def initialize(segments)
        # each segment gets 4 sides 
        @segments = segments.to_i
             
        @vertices = create_vertices
        # @edges = []
        # @sets = []
        # byebug
        if @segments == 2
            @template_planes = [find_step_plane_routing, find_reverse_step_plane_routing]
        else
            @template_planes = find_four_planes
        end
        # @edges, @sets = [], []#plane[0], plane[1]
        # @planes = plane_rotations(transform)
        # @planes = transform(@plane)
        # @reverse_planes = transform(@reverse_plane)
        # @planes = plane_rotations([]) # should be plane
        @planes = find_plane_combination(@template_planes) 
    end

    def create_vertices
        v = []
        x = 0
        y = 0
        
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

    def find_outgoers
        v_set = []
        @vertices.each do |v|
            if (v.x % @segments == 0) || (v.y % @segments == 0)
                v_set.append(v)
            end
        end
        v_set
    end

    def is_contained?(o, sets)
        sets.each do |s|
            if ((o.x == s.v.first.x && o.y == s.v.first.y && o.z == s.v.first.z) ||
                 (o.x == s.v.last.x && o.y == s.v.last.y && o.z == s.v.last.z))
                return true
            end
        end
        false 
    end

    def find_vertex(vs, x, y, z)
        vs.each do |v|
            if (v.x == x && v.y == y && v.z = z)
                return v
            end
        end
        nil
    end


    def find_step_plane_routing
        outgoers = find_outgoers
        plane_sets = []

        outgoers.each do |vertex|
            if is_contained?(vertex, plane_sets)
                next
            end

            i = 0
            outgoer_set = Set.new(vertex)
            curr = vertex
            while outgoer_set.v.length != 2
                
                next_vertex = nil
                if vertex.x == 0
                    if i % 2 == 0
                        # make right
                        next_vertex = find_vertex(@vertices, curr.x + 1, curr.y, curr.z)
                    else 
                        # make down
                        next_vertex = find_vertex(@vertices, curr.x, curr.y - 1, curr.z)
                    end
                    edge = Edge.new(curr, next_vertex)
                    curr = next_vertex
                    outgoer_set.add_edge(edge)
                    i += 1
                elsif vertex.y == @segments
                    if i % 2 == 0
                        # make down
                        next_vertex = find_vertex(@vertices, curr.x, curr.y - 1, curr.z)
                    else 
                        # make right
                        next_vertex = find_vertex(@vertices, curr.x + 1, curr.y, curr.z)
                    end
                    edge = Edge.new(curr, next_vertex)
                    curr = next_vertex
                    outgoer_set.add_edge(edge)
                    i += 1
                else
                    next
                end

                if outgoers.include? next_vertex
                    outgoer_set.add_node(next_vertex)
                end
            end
            plane_sets.append(outgoer_set)
        end
        plane_sets
    end

    def find_reverse_step_plane_routing
        outgoers = find_outgoers
        plane_sets = []

        outgoers.each do |vertex|
            if is_contained?(vertex, plane_sets)
                next
            end

            i = 0
            outgoer_set = Set.new(vertex)
            curr = vertex
            while outgoer_set.v.length != 2
                
                next_vertex = nil
                if vertex.x == 0
                    if i % 2 == 0
                        # make right
                        next_vertex = find_vertex(@vertices, curr.x + 1, curr.y, curr.z)
                    else 
                        # make up
                        next_vertex = find_vertex(@vertices, curr.x, curr.y + 1, curr.z)
                    end
                    edge = Edge.new(curr, next_vertex)
                    curr = next_vertex
                    outgoer_set.add_edge(edge)
                    i += 1
                elsif vertex.y == 0
                    if i % 2 == 0
                        # make up
                        next_vertex = find_vertex(@vertices, curr.x, curr.y + 1, curr.z)
                    else 
                        # make right
                        next_vertex = find_vertex(@vertices, curr.x + 1, curr.y, curr.z)
                    end
                    edge = Edge.new(curr, next_vertex)
                    curr = next_vertex
                    outgoer_set.add_edge(edge)
                    i += 1
                else
                    next
                end

                if outgoers.include? next_vertex
                    outgoer_set.add_node(next_vertex)
                end
            end
            plane_sets.append(outgoer_set)
        end
        plane_sets
    end

    # randomized algorithm that finds general plane routings
    # by selecting random start and end vertices
    def find_general_plane_routing
        outgoers = find_outgoers
        taken_outgoers = []
        taken_edges = []

        while taken_outgoers.length != outgoer.length
            s = outgoers[rand(0..(outgoers.length - 1))]
            outgoers.delete(s)
            t = outgoers[rand(0..(outgoers.length - 1))]
            dfs_edges = dfs(s, t)
            # first element of dfs_results tells whether s->t is
            # accessible and the second return the list of edges
            if dfs_edges != []
                outgoers.delete(t)
                taken_outgoers << [s, t]
                taken_edges << dfs_edges
            else
                outgoers << s
            end
        end
    end

    # performs depth first search starting from s and find a 
    # path to t if one is available, returns list of edges or []
    def dfs(s, t)
        visited = {}
        @vertices.each do |v|
            visited[v] = [] # empty array of edges
        end

        @vertices.each do |v|
            visited[v] = explore(s, v) unless visited[v] != []
        end

        visited[t]
    end

    def explore(s, v)
        
    end

    def find_plane_routing
        sets = initialize_sets
        singeltons = singeltons(sets)
        outgoers = outgoers(sets)
        edges = []
        queue = []
        i = 0
        while !connected(sets) && !full(sets)
             
            while !singeltons.empty?
                if queue.empty?
                    queue.append(singeltons.first) 
                elsif queue.first.e.length > 3
                    queue.delete_at(0)
                    singeltons.delete_at(0)
                else             
                    # singelton needs to have two vertices added
                    curr = queue.first
                    next_outgoer = find_next_closest_outgoer(outgoers, curr)
                    
                    outgoers.delete(next_outgoer)
                    
                    edge = nil
                    result = distance(next_outgoer, curr)
                    if result[0]  == 1
                        edge = connect_direct(result[1], curr)
                    else 
                        edge = connect_through_singeltons(next_outgoer, curr)
                    end
                    next_outgoer.add_edge(edge)
                    curr.add_edge(edge)

                    if curr.e == 2
                        new_set = merge_sets(curr.e.first[0], curr.e.last[0])
                        # new_edge = Edge.new()
                        outgoers.append(new_set)
                        
                    end
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
        # outgoers = (@segments - 1) * 4
        # loopers = loopers(sets)

        # if loop_set_num(sets) >= outgoers / 2
        #     for i in 0..(loopers.length - 1)
        #         for j in 0..(loopers.length - 1)
        #             if share_singelton(loopers[i], loopers[j]) && i != j
        #                 # implement adding or pruning edges
        #                 s = merge_loop_sets(loopers[i], loopers[j])
        #                 sets.delete(loopers[i])
        #                 sets.delete(loopers[j])
        #                 sets.append(s)
        #             end
        #         end
        #     end
        # end
        # implement a while loop if the number of looper is still greater than half of ourgoers
        [edges, sets]
    end

    # Finds the nex closest outgoing set from the given singelton
    def find_next_closest_outgoer(outgoers, singleton)
        s_x = singleton.v.first.x
        s_y = singleton.v.first.y
        s_z = singleton.v.first.z

        min = Float::INFINITY
        closest = nil

        outgoers.each do |outgoer|
            outgoer.v.each do |vertex|
                o_x = vertex.x
                o_y = vertex.y
                o_z = vertex.z
                
                d = Math.sqrt((s_x - o_x) ** 2 + (s_y - o_y) ** 2 + (s_z - o_z) ** 2)
                if d < min
                    closest = outgoer
                end
            end
        end
        closest
    end

    # Computes the distance between singelton and the outgoer set
    # Return true if the singelton is adjacent to the outgoer set and 
    # false otherwise  
    def distance(outgoer, singleton)
        s_x = singleton.v.first.x
        s_y = singleton.v.first.y
        s_z = singleton.v.first.z

        outgoer.v.each do |vertex|
            dist = 0
            o_x = vertex.x
            o_y = vertex.y
            o_z = vertex.z
            
            dist += (s_x - o_x) + (s_y - o_y) + (s_z - o_z)
            if dist.abs() == 1
                return [1, vertex]
            end
        end
        [-1, nil] 
    end


    def connect_through_singeltons(outgoer, singelton)

    end

    def connect_direct(outgoer, singelton)
        edge = Edge.new(outgoer, singelton)
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
            if !set.singelton && set.v.length < 2
                return false
            end
        end
        return true
    end


    def full(sets)
        sets = singeltons(sets)
        sets.each do |s|
            if s.e.length < 2
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

    def outgoers(sets)
        s = []
        sets.each do |set|
            if !set.singelton
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
    
    # Generates plane routings for other faces of the cube
    # back -> 0
    # top -> 1
    # bottom -> 2
    # left -> 3
    # right -> 4
    def transform(plane)
        plane_arr = [plane]
        #back - subtract z=dimension from all vertices
        back = deep_clone_and_transform_plane(plane, 0)
        plane_arr.append(back)

        top = deep_clone_and_transform_plane(plane, 1)
        plane_arr.append(top)

        bottom = deep_clone_and_transform_plane(plane, 2)
        plane_arr.append(back)

        left = deep_clone_and_transform_plane(plane, 3)
        plane_arr.append(left)

        right = deep_clone_and_transform_plane(plane, 4)
        plane_arr.append(right)
        plane_arr
    end
    
    def transform_arr(arr)
        new_arr = arr[1..arr.length-1]
        i = 1
        while i < arr.length
            arr[i] = deep_clone_and_transform_plane(arr[i], i - 1)
            i += 1
        end
        arr
    end
    #top - swap y and z and set y = dimension 
    #bottom - swap y and z and set y = 0
    #right - swap x and z and set x = dimension
    #left - swap x and z and set x = 0
    def deep_clone_and_transform_plane(obj, num)
        res = []
        edges_covered = []
        obj.each do |set|
            v_arr = []
            set.v.each do |v|
                case num
                when 0
                    v_arr.append(Vertex.new(v.x, v.y, v.z - @segments))
                when 1
                    v_arr.append(Vertex.new(v.x, v.z + @segments, -v.y))
                when 2
                    v_arr.append(Vertex.new(v.x, v.z, -v.y))
                when 3
                    v_arr.append(Vertex.new(v.z + @segments, v.y, -v.x))
                else 
                    v_arr.append(Vertex.new(v.z, v.y, -v.x))
                end
            end
            new_set = Set.new(v_arr.first)
            new_set.add_node(v_arr.last)
            
            
            set.e.each do |e|
                case num
                when 0
                    v1 = Vertex.new(e.v1.x, e.v1.y, e.v1.z - @segments)
                    v2 = Vertex.new(e.v2.x, e.v2.y, e.v2.z - @segments)
                when 1
                    v1 = Vertex.new(e.v1.x, e.v1.z + @segments, -e.v1.y)
                    v2 = Vertex.new(e.v2.x, e.v2.z + @segments, -e.v2.y)
                when 2
                    v1 = Vertex.new(e.v1.x, e.v1.z, -e.v1.y)
                    v2 = Vertex.new(e.v2.x, e.v2.z, -e.v2.y)
                when 3
                    v1 = Vertex.new(e.v1.z + @segments, e.v1.y, -e.v1.x)
                    v2 = Vertex.new(e.v2.z + @segments, e.v2.y, -e.v2.x)
                else
                    v1 = Vertex.new(e.v1.z, e.v1.y, -e.v1.x)
                    v2 = Vertex.new(e.v2.z, e.v2.y, -e.v2.x)
                end
                new_edge = Edge.new(v1, v2)
                new_set.add_edge(new_edge)        
            end
            res.append(new_set)
        end
        res
    end

    def plane_rotations(plane)
        [rotate(plane, 1), rotate(plane, 2), rotate(plane, 3)]
    end

    def rotate(plane, angle)
        find_reverse_step_plane_routing
    end

    # find 4 unique plane routings
    def find_four_planes
        planes = []
        while plane.length != 4
            new_plane = find_general_plane_routing
            if !includes_plane?(new_plane, planes)
                planes << new_plane
            end
        end
        planes
    end

    def find_plane_combination(planes)
        i = 0
        combinations = planes.product(planes, planes, planes, planes, planes)
        combinations.each do |c|
            
            arr = transform_arr(c)
            # byebug
            if has_one_loop(arr)
                return arr
            end
            i += 1
        end
        
        return nil
    end

    def has_one_loop(g)
     
        all_sets = []
        g.each do |plane|
            plane.each do |set|
                all_sets.append(set)
            end
        end
        # byebug
        next_set = all_sets.first
        starting_vertex = next_set.v.first
        end_vertex = next_set.v.last
        all_sets.delete(next_set)
        while !equals_vertex(starting_vertex, end_vertex)
            # do stuff
           
            res = find_next_set(all_sets, end_vertex)
            next_set = res[0]
            end_vertex = res[1]
            all_sets.delete(next_set)
        end

        if all_sets.length != 0
            # byebug
            return false
        end
        true
    end

    def equals_vertex(v1, v2)
        v1.x == v2.x && v1.y == v2.y && v1.z == v2.z
    end

    # bug here
    def find_next_set(sets, end_vertex)
        
        sets.each do |s|
            start_v = s.v.first
            end_v = s.v.last 
            
            if (equals_vertex(start_v, end_vertex)) 
                return [s, end_v]    
            end

            if (equals_vertex(end_v, end_vertex))
                return [s, start_v]
            end
        end
       
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
        if @planes == nil 
            return nil
        end
        plane_arr = []        
        @planes.each do |plane|
            p = Plane.new(plane)
            plane_arr.append(p.to_hash)
        end

        hash = {"segments": @segments,  "planes": plane_arr}

        JSON.generate(hash)
    end

    class Vertex
        attr_accessor :x, :y, :z

        def initialize(x, y, z=0)
            @x = x
            @y = y
            @z = z
        end

        def string
            "(#{@x}, #{@y}, #{@z})"
        end

        def to_hash
            {"x": @x, "y": @y, "z": @z}
        end

        def to_json
            JSON.generate({"x": @x, "y": @y, "z": @z})
        end

    end

    class Set
        attr_accessor :v, :singelton, :e

        def initialize(vertex, singelton=false)
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

        def sort_edges
            last_vertex = @v.first
            sorted_edges = []
            while sorted_edges != @e.length
                e = find_edge_starting_with(last_vertex)
                sort_edges.append(e)
                last_vertex = e.v2
            end
            sort_edges
        end

        def find_edge_starting_with(v)
            @e.each do |edge|
                if edge.v1 == v
                    return edge
                end
            end
        end

        def to_hash
            hash = {"vertices": @v, "edges": sort_edges, "singelton": singelton}
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