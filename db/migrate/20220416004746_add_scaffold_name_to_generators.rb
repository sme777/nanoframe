class AddScaffoldNameToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :scaffold_name, :string
  end
end
