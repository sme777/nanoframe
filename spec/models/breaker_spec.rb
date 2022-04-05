# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe Atom, type: :model do
  describe 'basic staple breaking operations' do
    before :all do
      @vs = []
      @vs << Vertex.new(1, 0, 0)
      @vs << Vertex.new(1, 1, 0)
      @vs << Vertex.new(2, 1, 0)
      @vs << Vertex.new(2, 1, -1)
      @vs << Vertex.new(2, 0, -1)
      @vs << Vertex.new(1, 0, -1)
      @vs << Vertex.new(1, 0, -2)
      @vs << Vertex.new(1, 1, -2)
      @vs << Vertex.new(2, 1, -2)
      @vs << Vertex.new(2, 1, -1)
      @vs << Vertex.new(2, 2, -1)
      @vs << Vertex.new(1, 2, -1)
      @vs << Vertex.new(1, 2, 0)
      @vs << Vertex.new(1, 1, 0)
      @vs << Vertex.new(0, 1, 0)
      @vs << Vertex.new(0, 1, -1)
      @vs << Vertex.new(0, 2, -1)
      @vs << Vertex.new(1, 2, -1)
      @vs << Vertex.new(1, 2, -2)
      @vs << Vertex.new(1, 1, -2)
      @vs << Vertex.new(0, 1, -2)
      @vs << Vertex.new(0, 1, -1)
      @vs << Vertex.new(0, 0, -1)
      @vs << Vertex.new(1, 0, -1)
    end

    it 'generates correct staple positions' do
      breaker = Breaker.new(0, [20, 20, 20], :cube, 2, 7249)
      Routing.normalize(@vs, 10, 10, 10)
      constraints = breaker.staples_preprocess
      staple_len_arr = breaker.staples_postprocess(breaker.ilp(constraints))

      _, staples = breaker.generate_staple_strands(@vs, staple_len_arr)
      # byebug
    end

    it 'generates correct staple positions' do
      breaker = Breaker.new(0, [20, 20, 20], :cube, 2, 7249)
      Routing.normalize(@vs, 10, 10, 10)
      constraints = breaker.staples_preprocess
      staple_len_arr = breaker.staples_postprocess(breaker.ilp(constraints))
      byebug
      edges, staples = breaker.generate_staple_strands(@vs, staple_len_arr)
      first_parititon, second_partition, boundary_edges = Routing.find_strongest_connected_components(edges,
                                                                                                    1/3.to_f, [20, 20, 20])
      breaker.update_boundary_strands(boundary_edges, staples)
    end

    # it 'generates correct staple positions' do
    #   breaker = Breaker.new(0, [50, 50, 50], :cube, 2, 7249)
    #   Routing.normalize(@vs, 25, 25, 25)
    #   constraints = breaker.staples_preprocess
    #   staple_len_arr = breaker.staples_postprocess(breaker.ilp(constraints))

    #   staples = breaker.generate_staple_strands(@vs, staple_len_arr)
    #   byebug
    # end
  end
end
