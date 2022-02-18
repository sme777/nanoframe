class CreatePlaygroundItems < ActiveRecord::Migration[6.1]
  def change
    create_table :playground_items do |t|
      t.string :geometry
      t.string :material

      t.timestamps
    end
  end
end
