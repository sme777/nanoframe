class AddNameDescriptionForkColumnsToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :name, :string
    add_column :generators, :fork, :boolean, default: false
  end
end
