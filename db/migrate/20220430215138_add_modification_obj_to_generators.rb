class AddModificationObjToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :staple_obj, :string
    add_column :generators, :edges_obj, :string
  end
end
