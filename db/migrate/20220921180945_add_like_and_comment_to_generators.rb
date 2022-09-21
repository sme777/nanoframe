class AddLikeAndCommentToGenerators < ActiveRecord::Migration[6.1]
  def change
    add_column :generators, :likes, :text, array: true, default: []
    add_column :generators, :comments, :text, array: true, default: []
  end
end
