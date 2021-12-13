# frozen_string_literal: true

class AddVerticesToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :vertices, :string
  end
end
