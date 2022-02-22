# frozen_string_literal: true

class AddNameToPlaygroundItems < ActiveRecord::Migration[6.1]
  def change
    add_column :playground_items, :name, :string
  end
end
