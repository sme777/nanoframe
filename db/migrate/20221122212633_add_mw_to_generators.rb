class AddMwToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :mw, :float
  end
end
