class FilterColumnsInGenerators < ActiveRecord::Migration[6.1]
  def change
    remove_column :generators, :height
    remove_column :generators, :width
    remove_column :generators, :depth
    remove_column :generators, :radius
    remove_column :generators, :scaffold_length
    remove_column :generators, :json
    remove_column :generators, :vertices
    remove_column :generators, :divisions
    remove_column :generators, :color_palette
    remove_column :generators, :staple_obj
    remove_column :generators, :edges_obj
    remove_column :generators, :graph_id
    remove_column :generators, :sequence
    remove_column :generators, :staples
    remove_column :generators, :routing

    add_column :generators, :dimensions, :jsonb, default: '{}'
    add_column :generators, :scaffold, :string
    add_column :generators, :colors, :float, array: true, default: []
    add_column :generators, :positions, :float, array: true, default: []
    add_column :generators, :staples, :jsonb, default: '{}'
    add_column :generators, :routing, :jsonb, default: '{}'
    
  end
end
