# frozen_string_literal: true

class AddTypeColToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :type, :string
  end
end
