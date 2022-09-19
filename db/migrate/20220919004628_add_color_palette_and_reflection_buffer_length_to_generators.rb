class AddColorPaletteAndReflectionBufferLengthToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :color_palette, :string
    add_column :generators, :reflection_buffer_length, :integer
  end
end
