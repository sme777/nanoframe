class AddRawGraphRoutingToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :raw_routing, :string
  end
end
