# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_01_015856) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "generators", force: :cascade do |t|
    t.float "height"
    t.float "width"
    t.float "depth"
    t.float "radius"
    t.integer "scaffold_length"
    t.string "shape"
    t.string "json"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "vertices"
    t.string "routing"
    t.integer "user_id"
    t.string "staples"
    t.integer "divisions"
    t.string "scaffold_name"
    t.integer "vertex_cuts"
    t.integer "bridge_length"
    t.string "color_palette"
    t.string "staple_obj"
    t.string "edges_obj"
    t.string "graph_id"
  end

  create_table "playground_items", force: :cascade do |t|
    t.string "geometry"
    t.string "material"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.string "dimensions"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "provider"
    t.string "uid"
  end

  add_foreign_key "generators", "users"
end
