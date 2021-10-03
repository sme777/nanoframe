class Plane
    attr_accessor :graph
    attr_accessor :up, :down, :left, :right

    def initialize(graph)
        @graph = graph
        @up, @down, @left, @right = nil, nil, nil, nil
    end


end