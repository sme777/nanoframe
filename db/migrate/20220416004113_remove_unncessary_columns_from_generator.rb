class RemoveUnncessaryColumnsFromGenerator < ActiveRecord::Migration[6.1]
  def change
    remove_column :generators, :radial_segment
    remove_column :generators, :radius_top
    remove_column :generators, :radius_bottom
    remove_column :generators, :width_segment
    remove_column :generators, :height_segment
    remove_column :generators, :depth_segment
    remove_column :generators, :tube_radius
    remove_column :generators, :tubular_radius
    remove_column :generators, :p
    remove_column :generators, :q
    remove_column :generators, :detail
    remove_column :generators, :option
    remove_column :generators, :raw_routing
    remove_column :generators, :visibility
  end
end
