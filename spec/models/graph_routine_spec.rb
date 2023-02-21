# frozen_string_literal: true

require 'rails_helper'
require 'graph_routines'

RSpec.describe 'GraphRoutine', type: :model do
  describe 'dfs module' do
    it 'correctly find a path in the given graph' do
        graph = {0 => [2, 1], 1 => [0, 2], 2 => [0, 1, 3], 3 => [2, 3]}
        paths = GraphRoutine.dfs(graph, 0, [], [])
        expect(paths[0]).to eq([2, 0])
        expect(paths[1]).to eq([1])
    end
  end
end