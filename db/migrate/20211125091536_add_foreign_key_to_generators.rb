class AddForeignKeyToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :user_id, :integer
    add_foreign_key :generators, :users
  end
end
