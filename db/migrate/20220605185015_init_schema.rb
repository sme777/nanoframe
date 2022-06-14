# frozen_string_literal: true

class InitSchema < ActiveRecord::Migration[6.1]
  def up
    # These are extensions that must be enabled in order to support this database
    enable_extension 'plpgsql'
    create_table 'active_storage_attachments' do |t|
      t.string 'name', null: false
      t.string 'record_type', null: false
      t.bigint 'record_id', null: false
      t.bigint 'blob_id', null: false
      t.datetime 'created_at', null: false
      t.index ['blob_id'], name: 'index_active_storage_attachments_on_blob_id'
      t.index %w[record_type record_id name blob_id], name: 'index_active_storage_attachments_uniqueness',
                                                      unique: true
    end
    create_table 'active_storage_blobs' do |t|
      t.string 'key', null: false
      t.string 'filename', null: false
      t.string 'content_type'
      t.text 'metadata'
      t.string 'service_name', null: false
      t.bigint 'byte_size', null: false
      t.string 'checksum', null: false
      t.datetime 'created_at', null: false
      t.index ['key'], name: 'index_active_storage_blobs_on_key', unique: true
    end
    create_table 'active_storage_variant_records' do |t|
      t.bigint 'blob_id', null: false
      t.string 'variation_digest', null: false
      t.index %w[blob_id variation_digest], name: 'index_active_storage_variant_records_uniqueness', unique: true
    end
    create_table 'generators' do |t|
      t.string 'shape'
      t.datetime 'created_at', precision: 6, null: false
      t.datetime 'updated_at', precision: 6, null: false
      t.string 'scaffold_name'
      t.integer 'vertex_cuts'
      t.integer 'bridge_length'
      t.jsonb 'dimensions', default: '{}'
      t.string 'scaffold'
      t.float 'colors', default: [], array: true
      t.float 'positions', default: [], array: true
      t.jsonb 'staples', default: '{}'
      t.jsonb 'routing', default: '{}'
    end
    create_table 'playground_items' do |t|
      t.string 'geometry'
      t.string 'material'
      t.datetime 'created_at', precision: 6, null: false
      t.datetime 'updated_at', precision: 6, null: false
      t.string 'name'
      t.string 'dimensions'
    end
    create_table 'users' do |t|
      t.string 'name'
      t.string 'username'
      t.string 'email'
      t.string 'password_digest'
      t.datetime 'created_at', precision: 6, null: false
      t.datetime 'updated_at', precision: 6, null: false
    end
    add_foreign_key 'active_storage_attachments', 'active_storage_blobs', column: 'blob_id'
    add_foreign_key 'active_storage_variant_records', 'active_storage_blobs', column: 'blob_id'
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'The initial migration is not revertable'
  end
end
