require 'rails_helper'
require 'json'

RSpec.describe Graph, type: :model do
  describe 'generates correct vertices' do
    it 'for 2 segment graph' do
        g = Graph.new(2)
        g.string_of_vertices.should eq("((0, 1), (1, 0), (1, 1), (1, 2), (2, 1))")
    end

    it 'for 5 segment graph' do
        g = Graph.new(5)
        g.string_of_vertices.should eq("((0, 1), (0, 2), (0, 3), (0, 4), (1, 0), (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), " + 
                                        "(2, 0), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (3, 0), (3, 1), (3, 2), (3, 3), " +
                                        "(3, 4), (3, 5), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (5, 1), (5, 2), (5, 3), (5, 4))")
    end
  end

  describe 'groups vertices into sets' do
    it 'adding each vertex to a set' do
      g = Graph.new(2)
      g.string_of_sets(g.initialize_sets).should eq("({(0, 1)}, {(1, 0)}, {(1, 1)}, {(1, 2)}, {(2, 1)})")
    end

  end

  describe 'merging sets' do
    it 'correctly merges two sets of unloopers with size 1' do 
      g = Graph.new(2)
      s1 = g.make_set(g.make_vertex(1, 0))
      s2 = g.make_set(g.make_vertex(0, 1))
      s3 = g.merge_sets(s1, s2)
      g.string_of_sets([s3]).should eq("({(1, 0), (0, 1)})") or eq("({(0, 1), (1, 0)})") 
    end

    it 'correctly merges two sets of unloopers with sizes 2 and 1' do
      g = Graph.new(3)
      s1 = g.make_set(g.make_vertex(1, 0))
      s1.add_node(g.make_vertex(2, 0))
      s2 = g.make_set(g.make_vertex(3, 0))
      s3 = g.merge_sets(s1, s2)
      g.string_of_sets([s3]).should eq("({(1, 0), (2, 0), (3, 0)})")
    end

    it 'correctly merges two sets of loopers', :pending=> true do 
      g = Graph.new(2)
      s1 = Set.new()
      s2 = Set.new()
      s3 = g.merge_loop_sets(s1, s2)
      g.string_of_sets(s3).should eq("")
    end
  end

  describe 'finds a valid routing' do
    it 'for 2 segment graph', :pending=> true do
        g = Graph.new(2)
        g.string_of_edges.should eq("((0, 1), (1, 0))->(1, 1), ((1, 2), (2, 1))->(1, 1)")
    end

    it 'for 3 segment graph', :pending=> true do

    end

    it 'for 5 segment graph', :pending=> true do

    end
  end

  describe 'JSONify graph data' do
    it 'for a sigle vertex' do 
      g = Graph.new(2)
      v = g.make_vertex(99, 99)
      v.to_json.should eq(JSON.generate({"x": 99, "y": 99}))
    end

    it 'for a single edge' do 
      g = Graph.new(2)
      v1 = g.make_vertex(99, 99)
      v2 = g.make_vertex(-99, -99)
      e = g.make_edge(v1, v2)
      e.to_json.should eq(JSON.generate({"v1": {"x": 99, "y": 99}, "v2": {"x": -99, "y": -99}}))
    end

    it 'for a set with two vertices and one edge' do 
      g = Graph.new(2)
      v1 = g.make_vertex(99, 99)
      v2 = g.make_vertex(-99, -99)
      s = g.make_set(v1, false)
      s.add_node(v2)
      e = g.make_edge(v1, v2)
      s.add_edge(e)
      s.to_json.should eq(JSON.generate({"vertices": [{"x": 99, "y": 99}, {"x": -99, "y": -99}], "edges": [{"v1": {"x": 99, "y": 99}, "v2": {"x": -99, "y": -99}}], "singelton": false}))
    end

    it 'for a graph made with two sets - one singelton and one not a singelton' do
      g = Graph.new(3)
      v1 = g.make_vertex(1, 0)
      v2 = g.make_vertex(0, 1)
      s1 = g.make_set(v1, false)
      s1.add_node(v2)
      v3 = g.make_vertex(1, 1)
      s2 = g.make_set(v3, true)
      e = g.make_edge(v2, v3)
      s2.add_edge(e)
      g.edges = [e]
      g.sets = [s1, s2]
      g.vertices = [v1, v2, v3]
      g.to_json.should eq(JSON.generate({"segments": 3, "vertices": [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 1}], 
                                          "edges": [{"v1": {"x": 0, "y": 1}, "v2": {"x": 1, "y": 1}}], 
                                          "sets": [
                                            {"vertices": [{"x": 1, "y": 0}, {"x": 0, "y": 1}], "edges": [], "singelton": false}, 
                                            {"vertices": [{"x": 1, "y": 1}], "edges": [{"v1":{"x":0,"y":1},"v2":{"x":1,"y":1}}], "singelton": true}
                                            ]
                                            }))
    end
  end
end
