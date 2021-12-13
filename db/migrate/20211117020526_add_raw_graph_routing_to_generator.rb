# frozen_string_literal: true

class AddRawGraphRoutingToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :raw_routing, :string
  end
end
