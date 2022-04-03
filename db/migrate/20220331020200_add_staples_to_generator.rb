class AddStaplesToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :staples, :string
  end
end
