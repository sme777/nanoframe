require 'rubygems'
require 'zip'

class Generator < ApplicationRecord
  attr_accessor :atom_count

  # attr_accessor :filename

  def scaffold(sequence, coordinates)
    @dna = []
    # byebug
    @atom_count = 0
    @graph = nil
    index = 0
    sequence.each do |tide|
      @atom_count += if tide == 'A'
                       32
                     elsif tide == 'T'
                       32
                     elsif tide == 'G'
                       33
                     else
                       30
                     end

      @dna.push(Nucleotide.new(tide, coordinates[index, index + 3], index))
      index += 3
    end
  end

  def self.generate_objects(step_size, loopout_length, min_len, max_len, scaff_length)
    min_len = min_len.to_i
    max_len = max_len.to_i
    scaff_length = scaff_length.to_i * 0.34
    step_size = step_size.to_i
    loopout_length = loopout_length.to_i
    # byebug
    seg = 1
    object3Ds = []
    # min_len ||=  10
    # max_len ||= 240
    # scaff_length ||= 7249 * 0.34
    hs = min_len
    ws = min_len
    ds = min_len
    count = 0
    while hs < max_len+1
      ws = min_len
      while ws < max_len + 1
        ds = min_len
        while ds < max_len + 1
          seg = 1
          while seg < 11
            count += 1
            res = hs * seg * 4 + ws * seg * 4 + ds * seg * 4
            if (((scaff_length - res) > 0) && ((scaff_length - res) < loopout_length))
              # byebug
              object3Ds.push(Object3D.new(hs, ws, ds, seg, (scaff_length - res)))
            end
            seg += 1
          end
          ds += step_size
        end
        ws += step_size
      end
      hs += step_size
    end
    # byebug
    object3Ds
  end


  def route
    if shape == "1"
      @graph = Graph.new(width_segment + 1)
      @plane = Plane.new(@graph)
    end
  end

  def feedback_control(_coordinates)
    shape_coordinates = silhouette
  end

  def silhouette
    coordinates = []
    # if @shape == "1"
    #     coordinates = cube_silhouette
    # byebug
    case shape

    when '1'
      cube_silhouette
    when '2'
      sphere_silhoutte
    when '3'
      cylinder_silhoutte
    when '4'
      cone_silhoutte
    when '5'
      polyhedron_silhoutte
    when '6'
      tetrahedron_silhoutte
    when '7'
      octahedron_silhoutte
    when '8'
      icosahedron_silhoutte
    when '9'
      dodecahedron_silhoutte
    when '10'
      torus_silhoutte
    when '11'
      torus_knot_silhoutte
    else
      custom_silhoutte
    end
  end

  def cube_silhouette; end

  def sphere_silhoutte; end

  def cylinder_silhoutte; end

  def cone_silhoutte; end

  def polyhedron_silhoutte; end

  def tetrahedron_silhoutte; end

  def octahedron_silhoutte; end

  def icosahedron_silhoutte; end

  def dodecahedron_silhoutte; end

  def torus_silhoutte; end

  def torus_knot_silhoutte; end

  def custom_silhoutte; end

  def to_json
    JSON.generate(@plane.to_hash)
  end


  # @note using tabs instead of spaces causes pdb loading issues
  def pdb
    filename = __id__.to_s
    file = File.open('app/assets/results/' + filename + '.pdb', 'w')
    count = 1
    base_count = 1
    file.write("MODEL        1\n")
    @dna.each do |nucleotide|
      nucleotide.atoms.each do |atom|
        file.write('ATOM' + ' ' * (7 - count.to_s.length))
        # file.write("\t")
        file.write(count.to_s)
        if atom.element.length == 4
          file.write(' ')
        else
          file.write('  ')
        end
        file.write(atom.element)

        if atom.element.length == 1
          file.write(' ' * 4)
        elsif atom.element.length == 2
          file.write(' ' * 3)
        else
          file.write(' ' * 2)
        end

        file.write(atom.base + ' ')
        file.write('A' + ' ' * 3 + base_count.to_s)
        # file.write("\n")
        if atom.x.negative?
          file.write(' ' * 5)
        else
          file.write(' ' * 6)
        end
        file.write('%0.03f' % atom.x)
        if atom.y.negative?
          file.write(' ' * 2)
        else
          file.write(' ' * 3)
        end
        # file.write(sprintf("%0.03f", atom.x) + "\t")
        file.write('%0.03f' % atom.y)

        if atom.z.negative?
          file.write(' ' * 2)
        else
          file.write(' ' * 3)
        end

        file.write('%0.03f' % atom.z)
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

  def oxdna; end

  def csv; end

  def fasta; end

  def txt; end

  def cadnano; end

  def bundle; end
end
