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

  before(:each) do
    @g2 = G2.new([50, 50, 50], 2, 7249)
    @g3 = G2.new([50, 50, 50], 3, 7249)
    @g4 = G2.new([50, 50, 50], 4, 7249)
    @g5 = G2.new([50, 50, 50], 5, 7249)
    @g6 = G2.new([50, 50, 50], 6, 7249)
    @g7 = G2.new([50, 50, 50], 7, 7249)
    @g8 = G2.new([50, 50, 50], 8, 7249)
    @g9 = G2.new([50, 50, 50], 9, 7249)
    @g10 = G2.new([50, 50, 50], 10, 7249)
    @g50 = G2.new([50, 50, 50], 50, 7249)
    @g100 = G2.new([50, 50, 50], 100, 7249)
    @g250 = G2.new([50, 50, 50], 250, 7249)
    @g500 = G2.new([50, 50, 50], 500, 7249)
    @g1000 = G2.new([50, 50, 50], 1000, 7249)
  end

  describe 'setup graph' do
    $stdout = File.new('logs.out', 'w')
    $stdout.sync = true
    Benchmark.bm(30) do |bm|
      9.times do |i|
        it "should setup for #{i + 2} segments" do
          bm.report("Create Vertices and Edges for #{i + 2} Segments") do
            instance_variable_get("@g#{i + 2}").create_vertices_and_edges
          end
        end
      end

      it 'setup for 50 segments' do
        bm.report('Create Vertices and Edges for 50 Segments') do
          @g50.create_vertices_and_edges
        end
      end

      it 'setup for 100 segments' do
        bm.report('Create Vertices and Edges for 100 Segments') do
          @g100.create_vertices_and_edges
        end
      end

      it 'setup for 250 segments' do
        bm.report('Create Vertices and Edges for 250 Segments') do
          @g250.create_vertices_and_edges
        end
      end

      it 'setup for 500 segments' do
        bm.report('Create Vertices and Edges for 500 Segments') do
          @g500.create_vertices_and_edges
        end
      end

      it 'setup for 1000 segments' do
        bm.report('Create Vertices and Edges for 1000 Segments') do
          @g1000.create_vertices_and_edges
        end
      end
    end
  end

  describe 'graph calculations' do
    before(:each) do
      6.times do |i|
        g = instance_variable_get("@g#{i + 2}")
        res = g.create_vertices_and_edges
        g.vertices = res[0]
        g.edges = res[1]
      end
    end

    describe 'find routing' do
      Benchmark.bm(30) do |bm|
        6.times do |i|
          it "should find routing for #{i + 2} segments" do
            bm.report("Find Single Routing for #{i + 2} segments") do
              instance_variable_get("@g#{i + 2}").find_general_plane_routing
            end
          end
        end
      end
    end

    describe 'find four plane routings' do
      Benchmark.bm(30) do |bm|
        6.times do |i|
          it "should find four planes for #{i + 2} segments" do
            bm.report("Find Four Planes for #{i + 2} segments") do
              instance_variable_get("@g#{i + 2}").find_four_planes
            end
          end
        end
      end
    end

    describe 'find shape routing' do
      before(:each) do
        6.times do |i|
          instance_variable_set("@template_#{i + 2}", instance_variable_get("@g#{i + 2}").find_four_planes)
        end
      end

      Benchmark.bm(30) do |bm|
        4.times do |i|
          it "should find shape routing for #{i + 2} segments" do
            bm.report("Find Shape Routing for #{i + 2} segments") do
              instance_variable_get("@g#{i + 2}").find_plane_combination(instance_variable_get("@template_#{i + 2}"))
            end
          end
        end
      end
    end
  end
end
