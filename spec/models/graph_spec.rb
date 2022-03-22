# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Ruby CBC', type: :api do
  describe 'staple breaking hierarchy' do
    it 'breaks even long extensions' do
        broken_staples = Graph.break_long_extension(178.0)
        expect(broken_staples).to eq([44, 45, 44, 45])
    end

  end
end
