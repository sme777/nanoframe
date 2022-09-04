# frozen_string_literal: true

class AddDescriptionAndRigidFieldsToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :description, :string
    add_column :generators, :rigid, :boolean
  end
end
