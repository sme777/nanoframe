class CreateRouters < ActiveRecord::Migration[6.1]
  def change
    create_table :routers do |t|
      t.string :shape
      t.string :coordinates
      t.string :sequence

      t.timestamps
    end
  end
end
