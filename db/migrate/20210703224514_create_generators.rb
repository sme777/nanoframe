class CreateGenerators < ActiveRecord::Migration[6.1]
  def change
    create_table :generators do |t|
      t.float :height
      t.float :width
      t.float :depth

      t.float :radius
      t.float :radial_segment
      t.float :radius_top
      t.float :radius_bottom
      t.float :width_segment
      t.float :height_segment
      t.float :tube_radius
      t.float :depth_segment

      t.float :tubular_radius
      t.float :p
      t.float :q

      t.integer :scaffold_length
      t.integer :detail
      t.string :shape
      t.string :option      
      t.string :json

      t.timestamps
    end
  end
end
