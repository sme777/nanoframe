class DropPlaygroundItemsTable < ActiveRecord::Migration[6.1]
  def change
    drop_table :playground_items
  end
end
