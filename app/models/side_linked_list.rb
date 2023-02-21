class SideLinkedList
    attr_accessor :first
    def initialize
        @first = nil
        @size = 0
    end

    class SideLinkedListNode
        attr_accessor :next, :prev, :graph, :rule
        def initialize
            @next = nil
            @prev = nil
            @graph = nil
            @rule = nil
        end
    end
end