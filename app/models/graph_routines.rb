require 'set'

module GraphRoutine
    # performs depth-first search from a given node
    # Params
    # graph   -- Graph construct
    # node    -- Start node
    # visited -- A map of visited nodes
    # psf     -- Path so far all nodes
    # rule    -- A rule to follow when searching
    def self.dfs(graph, node, visited, psf, rule)
        visited << node
        paths = []
        graph[node].each do |neighbor_node|
            psf << neighbor_node
            if !visited.include?(neighbor_node)
                dfs(graph, neighbor_node, visited, psf)
            end
            paths << psf
            psf = []
        end
        paths
    end


    # finds plane routing from given outgoer-ingoer nodes and edges
    # by selecting random start and end node and movement rule
    # Params
    # graph -- Graph construct
    # rule  -- A rule to follow when searching
    def self.find_plane_routing(graph, rule)
        outgoer_nodes = graph["outgoers"]
        outgoers_size = outgoer_nodes.size
        sets = Set.new()
        outgoers_size.times do
            start_node = outgoer_nodes[rand(0..(outgoers_size-1))]
            dfs_edges = GraphRoutine.dfs(graph, start_node, [], [], rule)
            path = dfs_edges[rand(0..(dfs_edges.size-1))]
            path << start_node
            path.each |node| do
                graph.delete(node)
            end
            sets << path
        end

        # Raise an exception unless the only remaining items are outgoers list
        raise "Not all nodes have been visited" unless x.size == 1
        sets
    end

    # find a unique number of q planes (collection of sets)
    # Params
    # sides_linked_list -- A linked list of sides
    def self.find_unique_planes(sides_linked_list)
        sides_hash = {}
        curr_side = sides_linked_list.first

        while curr_side.next != sides_linked_list.first
            curr_side_graph = curr_side["graph"]
            curr_side_rule = curr_side["rule"]
            curr_side_dim = curr_side["dim"]
            curr_side_thres = curr_side["thres"]
            if sides_hash[curr_side_dim].nil?
                sides_hash[curr_side_dim] = [GraphRoutine.find_plane_routing(graph, rule)]
            else
                next unless sides_hash[curr_side_dim] < curr_side_thres
                candidate_plane = GraphRoutine.find_plane_routing(graph, rule)
                i = 0
                while i != sides_hash[curr_side_dim].size
                    if candidate_plane == present_plane
                        candidate_plane = GraphRoutine.find_plane_routing(graph, rule)
                        i = 0
                    else
                        i += 1
                    end
                end
                sides_hash[curr_side_dim] << candidate_plane
            end
            curr_side = curr_side.next
        end
        sides_hash
    end

    # check whether the given routing has a single circular loop
    # Params
    # routing -- A unique combination of plane routings
    def self.has_single_circular_loop(routing)

    end


    def self.apply_transform(raw_comb, transform_matrix)

    end

    # finds a plane combination that yield one loop
    # Params
    # transform_matrix  -- Transform coordianes for each plane
    # sides_linked_list -- A linked list of connected sides
    def self.find_plane_combination(sides_linked_list, transform_matrix)
        unique_planes_hash = GraphRoutine.find_unique_planes(sides_linked_list)
        found = false
        unique_plane_arr = []
        curr_side = sides_linked_list.first.next
        while curr_side.next != sides_linked_list.first
            unique_plane_arr << unique_planes_hash[curr_side["dim"]]
            curr_side = curr_side.next
        end
        first_node_options = unique_planes_hash[sides_linked_list.first["dim"]]
        combinations = first_node_options.product(*unique_plane_arr)
        combinations.each do |c|
            transformed_routing = GraphRoutines.apply_transform(c, transform_matrix)
            if has_single_circular_loop(transformed_routing)
                found = true
                return transformed_routing
            end
        end

        raise "No routing was found for the given shape." unless !found
    end
end