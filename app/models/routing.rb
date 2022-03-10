# frozen_string_literal: true

module Routing

    @@prev_vertex = nil

    def self.find_next_set(sets, last_vertex, taken_sets)
        sets.each do |set|
            set.e.each do |edge|
                if self.equals(last_vertex, [edge.v1, edge.v2]) && !taken_sets.include?(set)
                    return set
                end
            end
        end
        nil
    end

    def self.merge_sets(planes_routing)
        sets = []
        planes_routing.each do |plane_route|
            plane_route.each do |set|
                sets << set
            end
        end
        sets
    end

    def self.sort_sets(planes_routing)
        sets = self.merge_sets(planes_routing)
        taken_sets = []
        edge_arr = []
        next_set = sets.first
        edges_and_last_vertex = self.get_edge_from_set(next_set)
        edge_arr += edges_and_last_vertex[0]
        last_vertex = edges_and_last_vertex[1]
        counter = 0
        taken_sets << sets[0]

        while (sets.length - 1 != counter)
            next_set = self.find_next_set(sets, last_vertex, taken_sets)
            taken_sets << next_set
            edges_and_last_vertex = self.get_edge_from_set(next_set)
            edge_arr += edges_and_last_vertex[0]
            last_vertex = edges_and_last_vertex[1]
            counter += 1
        end
        edge_arr << Vertex.new(@@prev_vertex.x, @@prev_vertex.y, @@prev_vertex.z)
        edge_arr
    end

    def self.get_edge_from_set(set)
        vectors = []
        # byebug
        set.e.reverse_each do |edge|
            if vectors.include?(edge.v1)
                vectors << edge.v1
            end

            if vectors.include?(edge.v2)
                vectors << edge.v2
            end
        end
        # byebug
        last_vertex = set.e.first.v2

        if self.equals(last_vertex, [@@prev_vertex])
            last_vertex = set.e.last.v1
            vectors = vectors.reverse
        end
        @@prev_vertex = last_vertex
        return [vectors[...-1], last_vertex]
    end

    def self.normalize(vectors, wsl, hsl, dsl)
        vectors.each do |vector|
            vector.x *= wsl
            vector.y *= hsl
            vector.z *= hsl
        end
        vectors
    end

    def self.equals(vertex, vals)
        return unless vertex != nil && vals.any?{ |v| !v.nil? } 
        vals.each do |val|
            if vertex.equals(val)
                return true
            end
        end
        false
    end


end
