class AddVertexCutsToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :vertex_cuts, :integer
  end
end
