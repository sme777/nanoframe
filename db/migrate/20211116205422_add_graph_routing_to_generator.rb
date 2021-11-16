class AddGraphRoutingToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :routing, :string
  end
end
