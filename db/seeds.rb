# frozen_string_literal: true

require_relative 'seed_data'

SeedData.items.each do |item|
  PlaygroundItem.create(item)
end
