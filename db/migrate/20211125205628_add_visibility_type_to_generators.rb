# frozen_string_literal: true

class AddVisibilityTypeToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :visibility, :string
  end
end
