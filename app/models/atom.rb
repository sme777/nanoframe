# frozen_string_literal: true

class Atom
  attr_accessor :base, :element, :x, :y, :z

  def initialize(base, element)
    @base = base
    @element = element
  end
end
