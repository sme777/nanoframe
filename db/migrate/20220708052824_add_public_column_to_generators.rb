class AddPublicColumnToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :public, :boolean
  end
end
