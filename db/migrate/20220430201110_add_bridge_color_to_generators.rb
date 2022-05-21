class AddBridgeColorToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :bridge_length, :integer
    add_column :generators, :color_palette, :string
  end
end
