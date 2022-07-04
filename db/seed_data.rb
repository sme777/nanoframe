# frozen_string_literal: true

module SeedData
  def self.open_file(name)
    file = File.open(name)
    contents = file.read
    file.close
    parse_data(contents)
  end

  def self.parse_data(json)
    parsed = JSON.parse(json)
    attributes = ['shape', 'scaffold_name', 'vertex_cuts', 'bridge_length', 'dimensions', 
      'scaffold', 'colors', 'positions', 'staples', 'routing']
    attr_hash= {}
    attributes.each do |attr|
      attr_hash[attr] = parsed[attr]
    end
    attr_hash["type"] = "PlaygroundItem"
    attr_hash
  end

  def self.items
    files = ['50x50x50x4_green.nfr', '50x50x50x4_red.nfr', '50x50x50x4_purple.nfr']
    files.map { |filename| SeedData.open_file("db/objects/#{filename}")}
  end
end
