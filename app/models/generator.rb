# frozen_string_literal: true

require 'rubygems'
require 'zip'
require 'date'
require 'object3D'
require 'oxdna_maker'

class Generator < ApplicationRecord
  has_one_attached :staples_csv

  attr_accessor :atom_count

  def self.generate_objects(step_size, loopout_length, min_len, max_len, scaff_length)
    min_len = min_len.to_i
    max_len = max_len.to_i
    scaff_length = scaff_length.to_i * 0.332
    step_size = step_size.to_i
    loopout_length = loopout_length.to_i
    seg = 1
    object3Ds = []
    hs = min_len
    ws = min_len
    ds = min_len
    count = 0
    while hs < max_len + 1
      ws = min_len
      while ws < max_len + 1
        ds = min_len
        while ds < max_len + 1
          seg = 1
          while seg < 11
            count += 1
            res = hs * seg * 4 + ws * seg * 4 + ds * seg * 4
            if (scaff_length - res).positive? && ((scaff_length - res) < loopout_length)
              object3Ds.push(Object3D.new(hs, ws, ds, seg, (scaff_length - res) / 0.332))
            end
            seg += 1
          end
          ds += step_size
        end
        ws += step_size
      end
      hs += step_size
    end
    object3Ds
  end

  def route
    @graph = Graph.new(id, dimensions, shape_name, scaffold)
  end

  def update_bridge_length(length)
    staple_arr = regenerate_staples
    boundary_edge_arr = regenerate_boundary_edges
    staple_breaker = Breaker.new(id, [width, height, depth], :cube, divisions + 1, scaffold_length)
    staple_breaker.update_boundary_strands(boundary_edge_arr, staple_arr, length)
  end

  def regenerate_staples
    arr = []
    staples[:sequences].each_with_index do |seq, idx|
      arr << Staple.new({ sequence: seq,
                          linear_points: staples[:linear_points][idx],
                          interpolated_points: staples[:interpolated_points][idx] })
    end
    arr
  end

  def update_color_pallette; end

  def make_staples_file(staples, descriptions)
    filename = "#{width}x#{height}x#{depth}-#{width_segment}"
    file = File.open("app/assets/results/#{filename}.csv", 'w')
    count = 0
    staples.each_with_index do |staple, idx|
      file.write("#{descriptions[idx]} , #{staple}")
      file.write("\n")
      count += 1
    end
    file.close
    filename
  end

  def to_json(*_args)
    @graph.to_json
  end

  def get_dimensions
    case shape_name
    when :cube
      "#{dimensions['width']}x#{dimensions['height']}x#{dimensions['depth']}x4"
    end
  end

  def self.m13mp18_p7249
    file = File.read('app/assets/scaffolds/7249.txt')
  end

  def self.supported_files
    %w[staples_csv nfr oxdna pdb bundle]
  end

  def self.color_palettes
    ['Leather Vintage', 'Cold Breeze', 'Pink Forest', 'Customize...']
  end

  def rgb2hex(rgb)
    r, g, b = rgb
    r = (r * 255).round
    g = (g * 255).round
    b = (b * 255).round
    hex = ''
    [r, g, b].each do |c|
      h = c.to_s(16)
      hex += if c < 16
               "0#{h}"
             else
               h
             end
    end
    "0x#{hex}"
  end

  def filename(logged, user_id)
    if logged
      curr_user = User.find(user_id)
      filename = "#{curr_user.username}_#{__id__}"
    else
      filename = "guest_#{__id__}"
    end
    filename
  end

  def staples_csv(filename)
    csv_file = "#{Rails.root.join('tmp')}/#{filename}.csv"
    file = File.open(csv_file, 'w')
    file.write("name,color,sequence,length\n")
    staples = self.staples['data']
    staples.each_with_index do |staple, _idx|
      color = staple['color']
      sequence = staple['sequence']
      name = staple['name']
      file.write("#{name},#{rgb2hex(color)},#{sequence},#{sequence.size}\n")
    end
    file.close
    ["#{filename}.csv"]
  end

  def oxdna(filename)
    oxdna_maker = OxDNAMaker.new
    scaffold_positions = positions
    scaffold_sequence = scaffold
    staples = self.staples
    staples_idxs = staples['data'].map { |e| e['indices'] }
    staples_sequences = staples['data'].map { |e| e['sequence'] }
    scaffold_positions, scaffold_a1s, scaffold_a3s, staples_positions, staples_a1s, staples_a3s = oxdna_maker.setup(
      scaffold_positions, staples_idxs[...staples_idxs.size]
    )
    dat_file = "#{Rails.root.join('tmp')}/#{filename}.dat"
    top_file = "#{Rails.root.join('tmp')}/#{filename}.top"
    f = File.open(dat_file, 'w')
    f.write("t = 0\n")
    f.write("b = 1000.0 1000.0 1000.0\n")
    f.write("E = 0. 0. 0.\n")
    scaffold_positions.each_with_index do |_pos, i|
      f.write("#{scaffold_positions[i][0]} #{scaffold_positions[i][1]} #{scaffold_positions[i][2]} #{scaffold_a1s[i][0]} #{scaffold_a1s[i][1]} #{scaffold_a1s[i][2]} #{scaffold_a3s[i][0]} #{scaffold_a3s[i][1]} #{scaffold_a3s[i][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")
    end

    staples_positions.each_with_index do |position, idx|
      j = 0
      while j < position.size
        f.write("#{staples_positions[idx][j][0]} #{staples_positions[idx][j][1]} #{staples_positions[idx][j][2]} #{staples_a1s[idx][j][0]} #{staples_a1s[idx][j][1]} #{staples_a1s[idx][j][2]} #{staples_a3s[idx][j][0]} #{staples_a3s[idx][j][1]} #{staples_a3s[idx][j][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")
        j += 1
      end
    end
    f.close

    f = File.open(top_file, 'w')
    f.write("#{scaffold_positions.size + staples_positions.map(&:size).sum} #{staples_sequences.size + 1}\n")
    i = 0
    scaffold_positions.each_with_index do |_position, idx|
      f.write("1 #{scaffold_sequence[idx]} #{i - 1} #{i + 1 < scaffold_positions.size ? i + 1 : -1}\n")
      i += 1
    end

    k = 2
    staples_positions.each_with_index do |position, idx|
      seq = staples_sequences[idx]
      j = 0
      while j < position.size

        f.write("#{k} #{seq[j]} #{j != 0 ? i - 1 : -1} #{j != (position.size - 1) ? i + 1 : -1}\n")
        j += 1
        i += 1
      end
      k += 1
    end

    f.close
    ["#{filename}.dat", "#{filename}.top"]
  end

  def pdb(filename)
    file = File.open("app/assets/results/#{filename}.pdb", 'w')
    count = 1
    base_count = 1
    file.write("MODEL        1\n")
    @dna.each_with_index do |nucleotide, i|
      nucleotide.atoms.each do |atom|
        file.write("ATOM#{' ' * (7 - count.to_s.length)}")
        # file.write("\t")
        file.write(count.to_s(16))
        if atom.element.length == 4
          file.write(' ')
        else
          file.write('  ')
        end
        file.write(atom.element)

        case atom.element.length
        when 1
          file.write(' ' * 4)
        when 2
          file.write(' ' * 3)
        else
          file.write(' ' * 2)
        end

        file.write("#{atom.base} ")
        file.write("A#{' ' * 3}#{base_count}")
        # file.write("\n")
        if atom.x.negative?
          file.write(' ' * 5)
        else
          file.write(' ' * 6)
        end
        file.write(format('%0.03f', atom.x))
        if atom.y.negative?
          file.write(' ' * 2)
        else
          file.write(' ' * 3)
        end
        # file.write(sprintf("%0.03f", atom.x) + "\t")
        file.write(format('%0.03f', (atom.y + 5 * i)))

        if atom.z.negative?
          file.write(' ' * 2)
        else
          file.write(' ' * 3)
        end

        file.write(format('%0.03f', atom.z))
        file.write(' ' * 2)
        # if atom.z.negative?
        #     file.write(" " * 2)
        # else
        #     file.write(" " * 3)
        # end
        file.write('1.00 0.00')
        file.write(' ' * 11)
        file.write(atom.element.first)
        file.write("\n")
        count += 1
      end
      base_count += 1
    end
    file.write('ENDMDL')
    file.close
    filename
  end

  def nfr(filename)
    nfr_file = "#{Rails.root.join('tmp')}/#{filename}.nfr"
    file = File.open(nfr_file, 'w')
    file.write(JSON.generate(attributes))
    file.close
    ["#{filename}.nfr"]
  end

  def cadnano; end

  def bundle(filename)
    oxdna_files = oxdna(filename)
    nfr_file = nfr(filename)
    staples_file = staples_csv(filename)
    # pdb_file = pdb(filename)
    [oxdna_files, nfr_file, staples_file].flatten # , pdb_file]
  end

  def self.scaffolds
    {
      "M13mp18 p7249": 'M13mp18 p7249',
      "M13mp18 p8064": 'M13mp18 p8064',
      "Custom": 'Custom'
    }
  end

  def self.scaffolds_to_length
    {
      "M13mp18 p7249": 7249,
      "M13mp18 p8064": 8064
    }
  end

  def self.shapes
    shapes = [
      'Cube (P1)',
      'Tetrahedron (P2)',
      'Octahedron (P3)',
      'Icosahedron (P4)',
      'Dodecahedron (P5)',
      'Truncated Tetrahedron (A1)',
      'Cuboctahedron (A2)',
      'Truncated Cube (A3)',
      'Truncated Octahedron (A4)',
      'Rhombicuboctahedron (A5)',
      'Truncated Cuboctahedron (A6)',
      'Snub Cube (A7)',
      'Icosidodecahedron (A8)',
      'Truncated Dodecahedron (A9)',
      'Truncated Icosahedron (A10)',
      'Rhombicosidodecahedron (A11)',
      'Truncated Icosidodecahedron (A12)',
      'Snub Dodecahedron (A13)',
      'Square Pyramid (J1)',
      'Pentagonal Pyramid (J2)',
      'Triangular Cupola (J3)',
      'Square Cupola (J4)',
      'Pentagonal Cupola (J5)',
      'Pentagonal Rotunda (J6)',
      'Elongated Triangular Pyramid (J7)',
      'Elongated Square Pyramid (J8)',
      'Elongated Pentagonal Pyramid (J9)',
      'Gyroelongated Square Pyramid (J10)',
      'Gyroelongated Pentagonal Pyramid (J11)',
      'Triangular Bipyramid (J12)',
      'Pentagonal Bipyramid (J13)',
      'Elongated Triangular Bipyramid (J14)',
      'Elongated Square Bipyramid (J15)',
      'Elongated Pentagonal Bipyramid (J16)',
      'Gyroelongated Square Bipyramid (J17)',
      'Elongated Triangular Cupola (J18)',
      'Elongated Square Cupola (J19)',
      'Elongated Pentagonal Cupola (J20)',
      'Elongated Pentagonal Rotunda (J21)',
      'Gyroelongated Triangular Cupola (J22)',
      'Gyroelongated Square Cupola (J23)',
      'Gyroelongated Pentagonal Cupola (J24)',
      'Gyroelongated Pentagonal Rotunda (J25)',
      'Gyrobifastigium (J26)',
      'Triangular Orthobicupola (J27)',
      'Square Orthobicupola (J28)',
      'Square Gyrobicupola (J29)',
      'Pentagonal Orthobicupola (J30)',
      'Pentagonal Gyrobicupola (J31)',
      'Pentagonal Orthocupolarotunda (J32)',
      'Pentagonal Gyrocupolarotunda (J33)',
      'Pentagonal Orthobirotunda (J34)',
      'Elongated Triangular Orthobicupola (J35)',
      'Elongated Triangular Gyrobicupola (J36)',
      'Elongated Square Gyrobicupola (J37)',
      'Elongated Pentagonal Orthobicupola (J38)',
      'Elongated Pentagonal Gyrobicupola (J39)',
      'Elongated Pentagonal Orthocupolarotunda (J40)',
      'Elongated Pentagonal Gyrocupolarotunda (J41)',
      'Elongated Pentagonal Orthobirotunda (J42)',
      'Elongated Pentagonal Gyrobirotunda (J43)',
      'Gyroelongated Triangular Bicupola (J44)',
      'Gyroelongated Square Bicupola (J45)',
      'Gyroelongated Pentagonal Bicupola (J46)',
      'Gyroelongated Pentagonal Cupolarotunda (J47)',
      'Gyroelongated Pentagonal Birotunda (J48)',
      'Augmented Triangular Prism (J49)',
      'Biaugmented Triangular Prism (J50)',
      'Triaugmented Triangular Prism (J51)',
      'Augmented Pentagonal Prism (J52)',
      'Biaugmented Pentagonal Prism (J53)',
      'Augmented Hexagonal Prism (J54)',
      'Parabiaugmented Hexagonal Prism (J55)',
      'Metabiaugmented Hexagonal Prism (J56)',
      'Triaugmented Hexagonal Prism (J57)',
      'Augmented Dodecahedron (J58)',
      'Parabiaugmented Dodecahedron (J59)',
      'Metabiaugmented Dodecahedron (J60)',
      'Triaugmented Dodecahedron (J61)',
      'Metabidiminished Icosahedron (J62)',
      'Tridiminished Icosahedron (J63)',
      'Augmented Tridiminished Icosahedron (J64)',
      'Augmented Truncated Tetrahedron (J65)',
      'Augmented Truncated Cube (J66)',
      'Biaugmented Truncated Cube (J67)',
      'Augmented Truncated Dodecahedron (J68)',
      'Parabiaugmented Truncated Dodecahedron (J69)',
      'Metabiaugmented Truncated Dodecahedron (J70)',
      'Triaugmented Truncated Dodecahedron (J71)',
      'Gyrate Rhombicosidodecahedron (J72)',
      'Parabigyrate Rhombicosidodecahedron (J73)',
      'Metabigyrate Rhombicosidodecahedron (J74)',
      'Trigyrate Rhombicosidodecahedron (J75)',
      'Diminished Rhombicosidodecahedron (J76)',
      'Paragyrate Diminished Rhombicosidodecahedron (J77)',
      'Metagyrate Diminished Rhombicosidodecahedron (J78)',
      'Bigyrate Diminished Rhombicosidodecahedron (J79)',
      'Parabidiminished Rhombicosidodecahedron (J80)',
      'Metabidiminished Rhombicosidodecahedron (J81)',
      'Gyrate Bidiminished Rhombicosidodecahedron (J82)',
      'Tridiminished Rhombicosidodecahedron (J83)',
      'Snub Disphenoid (J84)',
      'Snub Square Antiprism (J85)',
      'Sphenocorona (J86)',
      'Augmented Sphenocorona (J87)',
      'Sphenomegacorona (J88)',
      'Hebesphenomegacorona (J89)',
      'Disphenocingulum (J90)',
      'Bilunabirotunda (J91)',
      'Triangular Hebesphenorotunda (J92)'
    ]
    arr = {}
    shapes.each_with_index do |shape, _idx|
      arr[shape] = shape
    end
    arr
  end

  def self.supported_shapes
    ['Cube (P1)']
  end

  def shape_name
    shape.match(/(^.*)\s/).captures.first.downcase.parameterize(separator: '_').to_sym
  end

  def is_current_bridge_length(val)
    bridge_length == val
  end

  def is_current_color_palette(val)
    color_palette == val
  end
end
