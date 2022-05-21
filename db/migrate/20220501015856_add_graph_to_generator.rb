class AddGraphToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :graph_id, :string
  end
end
