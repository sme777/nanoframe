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

ActiveRecord::Schema.define(version: 2021_11_08_142100) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "generators", force: :cascade do |t|
    t.float "height"
    t.float "width"
    t.float "depth"
    t.float "radius"
    t.float "radial_segment"
    t.float "radius_top"
    t.float "radius_bottom"
    t.float "width_segment"
    t.float "height_segment"
    t.float "tube_radius"
    t.float "depth_segment"
    t.float "tubular_radius"
    t.float "p"
    t.float "q"
    t.integer "scaffold_length"
    t.integer "detail"
    t.string "shape"
    t.string "option"
    t.string "json"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "vertices"
  end

  create_table "routers", force: :cascade do |t|
    t.string "shape"
    t.string "coordinates"
    t.string "sequence"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
