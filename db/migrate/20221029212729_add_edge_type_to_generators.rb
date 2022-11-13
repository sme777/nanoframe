class AddEdgeTypeToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :edge_type, :string
  end
end
