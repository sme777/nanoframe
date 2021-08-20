class Shape
    attr_accessor :shape
    attr_accessor :value
    attr_accessor :disabled
    attr_accessor :selected

    def initialize(shape, value, disabled, selected)
        @shape = shape
        @value = value
        @disabled = disabled
        @selected = selected
    end

end