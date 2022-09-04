# frozen_string_literal: true

class AddAdvancedColumnsToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :exterior_extension_length, :integer
    add_column :generators, :interior_extension_length, :integer
    add_column :generators, :exterior_extension_bond_type, :string
    add_column :generators, :interior_extension_bond_type, :string
  end
end
