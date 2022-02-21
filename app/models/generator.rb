# frozen_string_literal: true

require 'rubygems'
require 'zip'
require 'date'
require 'Object3D'

class Generator < ApplicationRecord
  attr_accessor :atom_count

  def scaffold(sequence, coordinates)
    @dna = []
    @atom_count = 0
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

      @dna.push(Nucleotide.new(tide, coordinates[index, index + 3], index))
      index += 3
    end
  end

  def staples(sequence, coordinates); end

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
    case shape
    when '1'
      @graph = Graph.new([width, height, depth], :cube, width_segment + 1, scaffold_length)
    when '6'
      @graph = Graph.new([radius], :tetrahedron, width_segment + 1, scaffold_length)
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
end
