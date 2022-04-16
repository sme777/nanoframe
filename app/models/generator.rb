# frozen_string_literal: true

require 'rubygems'
require 'zip'
require 'date'
# require 'Object3D'

class Generator < ApplicationRecord
  attr_accessor :atom_count

  def scaffold(sequence, coordinates)
    @dna = []
    @atom_count = 0
    @sequence = sequence
    @coordinates = coordinates
    @graph = nil
    index = 0
    sequence.each do |tide|
      @atom_count += case tide
                     when 'A'
                       32
                     when 'T'
                       32
                     when 'G'
                       33
                     else
                       30
                     end

      @dna.push(Nucleotide.new(tide, @coordinates[index, index + 3], index))
      index += 3
    end
  end

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
    shape_name = shape.match(/(^.*)\s/).captures.first.downcase
    case shape_name
    when 'cube'
      @graph = Graph.new(id, [width, height, depth], :cube, divisions + 1, scaffold_length)
    when '2'
      @graph = Graph.new(id, [radius], :tetrahedron, divisions + 1, scaffold_length)
    when '3'
      @graph = Graph.new(id, [radius], :octahedron, divisions + 1, scaffold_length)
    when '4'
      @graph = Graph.new(id, [radius], :icosahedron, divisions + 1, scaffold_length)
    when '5'
      @graph = Graph.new(id, [radius], :dodecahedron, divisions + 1, scaffold_length)
    when '6'
      @graph = Graph.new(id, [radius], :truncated_tetrahedron, divisions + 1, scaffold_length)
    when '7'
      @graph = Graph.new(id, [radius], :cuboctahedron, divisions + 1, scaffold_length)
    when '8'
      @graph = Graph.new(id, [radius], :truncated_cube, divisions + 1, scaffold_length)
    when '9'
      @graph = Graph.new(id, [radius], :truncated_octahedron, divisions + 1, scaffold_length)
    when '10'
      @graph = Graph.new(id, [radius], :rhombicuboctahedron, divisions + 1, scaffold_length)
    when '11'
      @graph = Graph.new(id, [radius], :truncated_cuboctahedron, divisions + 1, scaffold_length)
    when '12'
      @graph = Graph.new(id, [radius], :snub_cube, divisions + 1, scaffold_length)
    when '13'
      @graph = Graph.new(id, [radius], :icosidodecahedron, divisions + 1, scaffold_length)
    when '14'
      @graph = Graph.new(id, [radius], :truncated_dodecahedron, divisions + 1, scaffold_length)
    when '15'
      @graph = Graph.new(id, [radius], :truncated_icosahedron, divisions + 1, scaffold_length)
    when '16'
      @graph = Graph.new(id, [radius], :rhombicosidodecahedron, divisions + 1, scaffold_length)
    when '17'
      @graph = Graph.new(id, [radius], :truncated_icosidodecahedron, divisions + 1, scaffold_length)
    when '18'
      @graph = Graph.new(id, [radius], :snub_dodecahedron, divisions + 1, scaffold_length)
    end
  end

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

  def self.m13_scaffold
    file = File.read('app/assets/scaffolds/7249.txt')
  end

  # @note using tabs instead of spaces causes pdb loading issues
  def normalize(seq)
    start = seq.first
    arr = []
    (1..seq.length - 1).each do |i|
      tide = seq[i]
      tide.x -= start.x
      tide.y -= start.y
      tide.z -= start.z
      arr << tide
    end
    start.x = 0
    start.y = 0
    start.z = 0
    [start] + arr
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

  def oxview(filename)
    filename = __id__.to_s
    file = File.open("app/assets/results/#{filename}.oxview", 'w')
    dateNow = DateTime.now.strftime('%FT%T%:z')
    date = `"date": "#{dateNow}"`
    file.write('{')
    file.write('"box": [1000, 1000, 1000],')
    file.write('"systems": [{')
    file.write('"id": 0,')
    file.write('"strands": [{')
    file.write('"id": 0,')
    file.write('"monomers": [')
    # loop for all strands
    byebug
    dna = @dna
    dna_len = dna.length - 1
    dir = 1
    rip1 = 0.012972598874543932.to_s
    rip2 = 0.8444614293366373
    rip3 = 0.5355880438590741.to_s

    (0..dna_len).each do |i|
      dir = -dir if (i % 20).zero?
      nucleotide = dna[i]
      file.write('{')
      file.write("\"id\": #{dna_len - i},")
      file.write("\"type\": \"#{nucleotide.base}\",")
      file.write('"class": "DNA",')
      file.write("\"p\": [#{nucleotide.x},#{nucleotide.y},#{nucleotide.z}],")
      # start backbone and stacking vectors
      # file.write('"a1": [' + (0.6*nucleotide.x).to_s + ',' + (0.6*nucleotide.y).to_s + ',' + nucleotide.z.to_s + '],')
      # file.write('"a1": [' + Math.sin(nucleotide.x).to_s + ',' + Math.cos(nucleotide.y).to_s + ',' + nucleotide.z.to_s + '],')
      # file.write('"a3": [' + (1.34*nucleotide.x).to_s + ',' + (1.34*nucleotide.y).to_s + ',' + (1.34*nucleotide.z).to_s + '],')
      rot1 = Math.sin(i * 15 * Math::PI / 180)
      rot2 = Math.cos(i * 15 * Math::PI / 180)
      leftover = (rot1 * rot1 + rot2 * rot2) > 1 ? 1 : (rot1 * rot1 + rot2 * rot2)
      rot3 = Math.sqrt(leftover).to_s
      rot1 = rot1.to_s
      rot2 = rot2.to_s
      file.write("\"a1\": [#{rot1}, #{rot2}, #{rot3}],")
      file.write("\"a3\": [#{rip1}, #{-dir * rip2}, #{rip3}],")
      # end backbone and sstacking vectors
      if i == dna_len
        file.write('"n3": -1,')
      else
        file.write("\"n3\": #{dna_len - i - 1},")
      end
      if i.zero?
        file.write('"n5": 0,')
      else
        file.write("\"n5\": #{dna_len - i + 1},")
      end
      file.write('"cluster": 3,')
      file.write("\"bp\": #{dna_len + 1 - i}")
      if i == dna_len
        file.write('}')
      else
        file.write('},')
      end
    end
    file.write('],')
    file.write('"end3": 0,')
    file.write(`"end5": #{dna_len} ,`)
    file.write('"class": "NucleicAcidStrand"')
    file.write('}]')
    file.write('}],')
    file.write('"forces": []')
    file.write('}')
    file.close
    filename
  end

  def csv; end

  def fasta; end

  def txt; end

  def cadnano; end

  def bundle; end

  def self.scaffolds
    {
      "M13mp18 p7249": "M13mp18 p7249",
      "M13mp18 p8064": "M13mp18 p8064",
      "Custom": "Custom"
    }

  end

  def self.scaffolds_to_length
    {
      "M13mp18 p7249": 7249,
      "M13mp18 p8064": 8064,
    }
  end

  def self.shapes
    shapes = [
      "Cube (P1)",
      "Tetrahedron (P2)",
      "Octahedron (P3)",
      "Icosahedron (P4)",
      "Dodecahedron (P5)",
      "Truncated Tetrahedron (A1)",
      "Cuboctahedron (A2)",
      "Truncated Cube (A3)",
      "Truncated Octahedron (A4)",
      "Rhombicuboctahedron (A5)",
      "Truncated Cuboctahedron (A6)",
      "Snub Cube (A7)",
      "Icosidodecahedron (A8)",
      "Truncated Dodecahedron (A9)",
      "Truncated Icosahedron (A10)",
      "Rhombicosidodecahedron (A11)",
      "Truncated Icosidodecahedron (A12)",
      "Snub Dodecahedron (A13)",
      "Square Pyramid (J1)",
      "Pentagonal Pyramid (J2)",
      "Triangular Cupola (J3)",
      "Square Cupola (J4)",
      "Pentagonal Cupola (J5)",
      "Pentagonal Rotunda (J6)",
      "Elongated Triangular Pyramid (J7)",
      "Elongated Square Pyramid (J8)",
      "Elongated Pentagonal Pyramid (J9)",
      "Gyroelongated Square Pyramid (J10)",
      "Gyroelongated Pentagonal Pyramid (J11)",
      "Triangular Bipyramid (J12)",
      "Pentagonal Bipyramid (J13)",
      "Elongated Triangular Bipyramid (J14)",
      "Elongated Square Bipyramid (J15)",
      "Elongated Pentagonal Bipyramid (J16)",
      "Gyroelongated Square Bipyramid (J17)",
      "Elongated Triangular Cupola (J18)",
      "Elongated Square Cupola (J19)",
      "Elongated Pentagonal Cupola (J20)",
      "Elongated Pentagonal Rotunda (J21)",
      "Gyroelongated Triangular Cupola (J22)",
      "Gyroelongated Square Cupola (J23)",
      "Gyroelongated Pentagonal Cupola (J24)",
      "Gyroelongated Pentagonal Rotunda (J25)",
      "Gyrobifastigium (J26)",
      "Triangular Orthobicupola (J27)",
      "Square Orthobicupola (J28)",
      "Square Gyrobicupola (J29)",
      "Pentagonal Orthobicupola (J30)",
      "Pentagonal Gyrobicupola (J31)",
      "Pentagonal Orthocupolarotunda (J32)",
      "Pentagonal Gyrocupolarotunda (J33)",
      "Pentagonal Orthobirotunda (J34)",
      "Elongated Triangular Orthobicupola (J35)",
      "Elongated Triangular Gyrobicupola (J36)",
      "Elongated Square Gyrobicupola (J37)",
      "Elongated Pentagonal Orthobicupola (J38)",
      "Elongated Pentagonal Gyrobicupola (J39)",
      "Elongated Pentagonal Orthocupolarotunda (J40)",
      "Elongated Pentagonal Gyrocupolarotunda (J41)",
      "Elongated Pentagonal Orthobirotunda (J42)",
      "Elongated Pentagonal Gyrobirotunda (J43)",
      "Gyroelongated Triangular Bicupola (J44)",
      "Gyroelongated Square Bicupola (J45)",
      "Gyroelongated Pentagonal Bicupola (J46)",
      "Gyroelongated Pentagonal Cupolarotunda (J47)",
      "Gyroelongated Pentagonal Birotunda (J48)",
      "Augmented Triangular Prism (J49)",
      "Biaugmented Triangular Prism (J50)",
      "Triaugmented Triangular Prism (J51)",
      "Augmented Pentagonal Prism (J52)",
      "Biaugmented Pentagonal Prism (J53)",
      "Augmented Hexagonal Prism (J54)",
      "Parabiaugmented Hexagonal Prism (J55)",
      "Metabiaugmented Hexagonal Prism (J56)",
      "Triaugmented Hexagonal Prism (J57)"
    ]
    arr = {}
    shapes.each_with_index do |shape, idx|
      arr[shape] = shape
    end
    arr
  end
end
