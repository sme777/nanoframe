# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

require 'json'
require 'benchmark'

RSpec.describe Graph, type: :model do
  class G2 < Graph
    def initialize(dimensions, segments, scaff_length)
      @width = dimensions[0]
      @height = dimensions[1]
      @depth = dimensions[2]
      @segments = segments.to_i
      @scaff_length = scaff_length
    end
  end

  describe 'for tetrahedron' do
    describe 'creating vertices' do
      it 'should create vertices for 2 segments' do
        g = G2.new([30, 30, 30], 2, 7249)
        Vertex.string_of_vertices(g.get_vertices(:triangle)) # .to eq("((0.5, #{(Math.sqrt(3)/2).round(3)}, 0), (1.0, 0, 0), (2.0, #{(Math.sqrt(3)).round(3)}, 0) (1.0, #{Math.sqrt(3).round(3)}, 0), (2.0, 0, 0), (2.5, #{(Math.sqrt(3)/2).round(3)}, 0))")
      end

      it 'should create vertices for 4 segments' do
        g = G2.new([30, 30, 30], 4, 7249)
        Vertex.string_of_vertices(g.get_vertices(:triangle))
      end
    end

    # describe 'connectin vertices' do
    #   it 'should connect vertices for 2 segments' do
    #     g = G2.new([30, 30, 30], 2, 7249)
    #     v = g.get_vertices(:triangle)
    #     Edge.beautify_edges(g.connect_vertices(v))
    #   end

    #   it 'should connect vertices for 2 segments' do
    #     g = G2.new([30, 30, 30], 4, 7249)
    #     v = g.get_vertices(:triangle)
    #     puts Edge.beautify_edges(g.connect_vertices(v))
    #   end
    # end
  end
end
