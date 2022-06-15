# frozen_string_literal: true

module SeedData
  def self.open_file(name)
    file = File.open(name)
    contents = file.read
    file.close
    contents
  end

  def self.items
    [
      {
        name: 'Cube (P1)',
        dimensions: '30x30x140x3',
        geometry: SeedData.open_file('db/objects/30x30x140x3_pos.txt'),
        material: SeedData.open_file('db/objects/30x30x140x3_col.txt')
      },

      {
        name: 'Cube (P1)',
        dimensions: '30x100x70x3',
        geometry: SeedData.open_file('db/objects/30x100x70x3_pos.txt'),
        material: SeedData.open_file('db/objects/30x100x70x3_col.txt')
      },

      {
        name: 'Cube (P1)',
        dimensions: '80x50x20x4',
        geometry: SeedData.open_file('db/objects/80x50x20x4_pos.txt'),
        material: SeedData.open_file('db/objects/80x50x20x4_col.txt')
      },
      {
        name: 'Cube (P1)',
        dimensions: '10x20x90x5',
        geometry: SeedData.open_file('db/objects/10x20x90x5_pos.txt'),
        material: SeedData.open_file('db/objects/10x20x90x5_col.txt')
      },
      {
        name: 'Cube (P1)',
        dimensions: '100x10x10x5',
        geometry: SeedData.open_file('db/objects/100x10x10x5_pos.txt'),
        material: SeedData.open_file('db/objects/100x10x10x5_col.txt')
      },
      {
        name: 'Cube (P1)',
        dimensions: '20x10x70x6',
        geometry: SeedData.open_file('db/objects/20x10x70x6_pos.txt'),
        material: SeedData.open_file('db/objects/20x10x70x6_col.txt')
      }
    ]
  end
end
