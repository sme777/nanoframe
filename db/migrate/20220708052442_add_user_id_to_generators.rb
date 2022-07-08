class AddUserIdToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :user_id, :string
  end
end
