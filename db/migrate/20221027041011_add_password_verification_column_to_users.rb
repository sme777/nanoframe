class AddPasswordVerificationColumnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :reset_password_verified, :boolean
  end
end
