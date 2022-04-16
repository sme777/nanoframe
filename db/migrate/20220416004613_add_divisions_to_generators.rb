class AddDivisionsToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :divisions, :integer
  end
end
