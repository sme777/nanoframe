# frozen_string_literal: true

require 'rails_helper'
require 'json'

RSpec.describe GraphSet, type: :model do
  describe 'joins multiple vertices in a group' do
    it 'sucessfully creates a Set object' do
      set = GraphSet.new(double(Vertex))
      set.should_not be_nil
    end
  end
end
