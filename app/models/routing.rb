# frozen_string_literal: true

module Routing

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
            plane_route.sets.each do |set|
                sets << set
            end
        end
    end

    def sort_sets

    end

    def get_edge_from_set

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
        vals.each do |val|
            if vertex.equals(val)
                return true
            end
        end
        false
    end

end
