class Shape
  attr_accessor :shape, :value, :disabled, :selected

  def initialize(shape, value, disabled, selected)
    @shape = shape
    @value = value
    @disabled = disabled
    @selected = selected
  end
end
