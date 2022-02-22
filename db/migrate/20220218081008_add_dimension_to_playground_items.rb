# frozen_string_literal: true

class AddDimensionToPlaygroundItems < ActiveRecord::Migration[6.1]
  def change
    add_column :playground_items, :dimensions, :string
  end
end
