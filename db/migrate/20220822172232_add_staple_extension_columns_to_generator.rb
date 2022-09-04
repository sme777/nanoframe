# frozen_string_literal: true

class AddStapleExtensionColumnsToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :exterior_extensions, :text, array: true, default: []
    add_column :generators, :interior_extensions, :text, array: true, default: []
  end
end
