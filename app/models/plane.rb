class Plane
    attr_accessor :graph
    attr_accessor :up, :down, :left, :right

    def initialize(graph)
        @graph = graph
        @up, @down, @left, @right = nil, nil, nil, nil
    end

    def to_hash
        sets_arr = []
        # byebug
        @graph.plane.each do |set|
            # byebug
            edges_arr = []
            set.e.each do |edge|
                # byebug
                edges_arr.append(edge.to_hash)
            end
            set_hash = {edges: edges_arr}
            sets_arr.append(set_hash)
        end
        {"sets": sets_arr}
    end


end