class AddSequenceToGenerator < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :sequence, :string
  end
end
