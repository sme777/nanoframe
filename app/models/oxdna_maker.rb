# frozen_string_literal: true

require 'matrix'

class OxDNAMaker
  POS_BASE = 0.4
  CM_CENTER_DS = POS_BASE + 0.2
  BASE_BASE = 0.3897628551303122

  def setup(positions, staples_idxs, staples_points)
    scaffold_positions = []
    scaffold_a1s = []
    scaffold_a3s = []
    scaffold_nt_hash = {}
    staples_positions = []
    staples_a1s = []
    staples_a3s = []

    dir_X = Vector[1, 0, 0]
    dir_Y = Vector[0, 1, 0]
    dir_Z = Vector[0, 0, 1]
    rot = 0.0

    r_X = rotation_matrix(dir_X, [1, 'bp'])
    r_Y = rotation_matrix(dir_Y, [1, 'bp'])
    r_Z = rotation_matrix(dir_Z, [1, 'bp'])
    r0 = Matrix.identity(3)

    dir_axis, largest_delta_idx = directional_change_axis(positions[1], positions[0])
    dir_axis_prv = dir_axis
    largest_delta_prv_idx = largest_delta_idx
    dir_ch, dir_vec = directional_change(positions[1], positions[0])
    dir_ch_prv = dir_ch

    a3 = dir_vec <= 0 ? binding.local_variable_get("dir_#{dir_ch}") : -binding.local_variable_get("dir_#{dir_ch}")
    v1 = Vector[rand, rand, rand]
    v1 -= a3 * a3.inner_product(v1)
    v1 /= Math.sqrt(v1.inner_product(v1))
    a1 = v1
    rb = Vector[positions[0][0], positions[0][1], positions[0][2]]
    # rbs = [rb]
    curr_R0 = r0
    curr_R = binding.local_variable_get("r_#{dir_ch}")

    scaffold_nts_hash = {}
    current_prime_dir = :X
    prev_prime_dir = :X
    positions.each_with_index do |pos, idx|
      dir_axis, largest_delta_idx = directional_change_axis(positions[idx], positions[idx - 1]) unless idx < 1
      unless idx < 2
        dir_axis_prv, largest_delta_prv_idx = directional_change_axis(positions[idx - 1],
                                                                      positions[idx - 2])
      end
      dir_ch_prv, = directional_change(positions[idx - 1], positions[idx - 2]) if idx != 0
      dir_ch, dir_vec = directional_change(positions[idx], positions[idx - 1]) if idx != 0

      if idx != 0
        curr_R = Matrix.identity(3)
        sub_vec = Vertex.new(
          positions[idx][0] - positions[idx - 1][0],
          positions[idx][1] - positions[idx - 1][1],
          positions[idx][2] - positions[idx - 1][2]
        )
        euler_angles = sub_vec.euler_angles
        a3 = Vector[0, 0, 0]
        dir_axis.each_with_index do |ax, i|
          a3 += binding.local_variable_get("dir_#{ax[0]}") * ax[1]
        end
        a3 = a3.normalize

        euler_angles.each_with_index do |e, i|
          euler_angles[i] = 0 if (e % Math::PI).zero?

          euler_angles[i] = 1 if 1 - e.abs < 10e-5 && e < 1

          euler_angles[i] = 0 if e.abs < 10e-5 # && e > 0
        end
        euler_angles = Vector[euler_angles[0], euler_angles[1], euler_angles[2]].normalize
        curr_R = (rotation_matrix(dir_Z,
                                  [euler_angles[2],
                                   'bp']) * rotation_matrix(dir_Y,
                                                            [euler_angles[1],
                                                             'bp'])) * rotation_matrix(dir_X, [euler_angles[0], 'bp'])
        if dir_axis.keys != dir_axis_prv.keys && dir_axis.size == 1
          v1 = a1 # Vector[rand, rand, rand]
          v1 -= a3 * a3.inner_product(v1)
          v1 = v1.normalize
          a1 = v1
        end
      end

      position = (rb - CM_CENTER_DS * a1)
      a1 = curr_R * a1
      a1 = a1.normalize
      rb += a3 * BASE_BASE
      a1_d = -a1
      a3_d = -a3
      position_d = (rb - CM_CENTER_DS * a1_d)

      scaffold_positions << position
      scaffold_a1s << a1
      scaffold_a3s << a3
      scaffold_nt_hash[idx] = [position_d, a1_d, a3_d, rb]
      # rbs << rb
    end

    staples_idxs.each_with_index do |staple_idxs, j|
      staple_points = staples_points[j]
      staple_positions = []
      staple_a1s = []
      staple_a3s = []
      grow_front = %w[eout1 eout2 ein1 ein2].include?(staple_idxs.first)
      grow_back = %w[eout1 eout2 ein1 ein2].include?(staple_idxs.last)
      covered_front = false
      covered_back = false

      staple_idxs.each_with_index do |idx, i|
        case idx
        
        when 'skip'
          # byebug
          # next if staple_idxs[i - 1] == "skip"
          # prev_complimentary_data = scaffold_nt_hash[staple_idxs[i - 1]]
          # next_complimentary_data, length = find_next_anchor_point(scaffold_nt_hash, staple_idxs, i + 1)
          # # byebug if length.nil?
          # next if length.nil?
          # length.times do |step|
          #   staple_positions << (length - step) / length.to_f * prev_complimentary_data[0] + (step) / length.to_f * next_complimentary_data[0]
          #   staple_a1s << (length - step) / length.to_f * prev_complimentary_data[1] + (step) / length.to_f * next_complimentary_data[1]
          #   staple_a3s << (length - step) / length.to_f * prev_complimentary_data[2] + (step) / length.to_f * next_complimentary_data[2]
          # end
          scaffold_nt_hash[staple_idxs[i + 1]]
          if prev_complimentary_data.nil? || next_complimentary_data.nil?
            prev_complimentary_data, next_complimentary_data = find_closest_anchor_points_and_range(scaffold_nt_hash, idx)
          end
          next if next_complimentary_data.nil? || prev_complimentary_data.nil?
          staple_positions << (prev_complimentary_data[0] + next_complimentary_data[0]) / 2
          staple_a1s << (prev_complimentary_data[1] + next_complimentary_data[1]) / 2
          staple_a3s << (prev_complimentary_data[2] + next_complimentary_data[2]) / 2
        when 'eout1', 'ein1'
          next unless grow_front ^ covered_front # && !(grow_back ^ covered_back)

          mod_i = staple_idxs.index { |n| n.instance_of?(Integer) }
          orth, side = orthogonal_dimension(staple_points[mod_i], staple_points[mod_i + 1], :cube, [50, 50, 50])
          delta = idx == 'ein1' ? 1 : -1
          case orth
          when :x
            case side
            when :S5
              a3 = dir_X * delta
            when :S6
              a3 = -dir_X * delta
            end
            ein_rot = r_X
          when :y
            case side
            when :S3
              a3 = dir_Y * delta
            when :S4
              a3 = -dir_Y * delta
            end
            ein_rot = r_Y
          when :z
            case side
            when :S1
              a3 = -dir_Z * delta
            when :S2
              a3 = dir_Z * delta
            end
            ein_rot = r_Z
          end

          ein_positions = []
          ein_a1s = []
          ein_a3s = []
          last_rb = scaffold_nt_hash[staple_idxs[mod_i]][3]
          v1 = scaffold_nt_hash[staple_idxs[mod_i]][1]
          v1 -= a3 * a3.inner_product(v1)
          v1 = v1.normalize
          a1 = v1
          end_idx = mod_i
          while i < end_idx
            position = (last_rb - CM_CENTER_DS * a1)
            a1 = ein_rot * a1
            last_rb += a3 * BASE_BASE
            ein_positions << position
            ein_a1s << a1
            ein_a3s << a3
            i += 1
          end

          staple_positions = ein_positions.reverse + staple_positions
          staple_a1s = ein_a1s.reverse + staple_a1s
          staple_a3s = ein_a3s.reverse + staple_a3s
          covered_front = true

        when 'eout2', 'ein2'
          next unless grow_back ^ covered_back

          orth, side = orthogonal_dimension(staple_points[i - 1], staple_points[i - 2], :cube, [50, 50, 50])
          delta = idx == 'ein2' ? 1 : -1
          case orth
          when :x
            case side
            when :S5
              a3 = dir_X * delta
            when :S6
              a3 = -dir_X * delta
            end
            ein_rot = r_X
          when :y
            case side
            when :S3
              a3 = dir_Y * delta
            when :S4
              a3 = -dir_Y * delta
            end
            ein_rot = r_Y
          when :z
            case side
            when :S1
              a3 = -dir_Z * delta
            when :S2
              a3 = dir_Z * delta
            end
            ein_rot = r_Z
          end

          ein_positions = []
          ein_a1s = []
          ein_a3s = []
          # begin/
            last_rb = scaffold_nt_hash[staple_idxs[i - 5]][3] # changed from -1
          # rescue NoMethodError => e
          #   byebug
          # end
          v1 = scaffold_nt_hash[staple_idxs[i - 5]][1]
          v1 -= a3 * a3.inner_product(v1)
          v1 = v1.normalize
          a1 = v1
          end_idx = staple_idxs.size
          while i < end_idx
            position = (last_rb - CM_CENTER_DS * a1)
            a1 = ein_rot * a1
            last_rb += a3 * BASE_BASE
            ein_positions << position
            ein_a1s << a1
            ein_a3s << a3
            i += 1
          end

          staple_positions.concat(ein_positions)
          staple_a1s.concat(ein_a1s)
          staple_a3s.concat(ein_a3s)
          covered_back = true
        else
          complimentary_data = scaffold_nt_hash[(idx - 1) % scaffold_nt_hash.size]
          staple_positions << complimentary_data[0]
          staple_a1s << complimentary_data[1]
          staple_a3s << complimentary_data[2]
        end
      end
      staples_positions << staple_positions
      staples_a1s << staple_a1s
      staples_a3s << staple_a3s
    end

    [scaffold_positions, scaffold_a1s, scaffold_a3s, staples_positions, staples_a1s, staples_a3s]
  end


  def find_next_anchor_point(staple_nt_hash, staple_idx, idx)
    for i in idx...staple_idx.size
      if staple_idx[i] != "skip" || staple_idx[i] != "eout1" || staple_idx[i] != "eout2" || staple_idx[i] != "ein1" || staple_idx[i] != "ein2" 
        # byebug if staple_nt_hash[staple_idx[i]].nil?
        return [staple_nt_hash[staple_idx[i]], i-idx+1]
      end
    end
  end

  def orthogonal_dimension(v1, v2, shape, dimensions)
    Plane.orthogonal_dimension(Vertex.new(v1[0], v1[1], v1[2]), Vertex.new(v2[0], v2[1], v2[2]), shape, dimensions)
  end

  def rotation_matrix(axis, angles)
    angle = if angles.is_a?(Array)
              if angles.size > 1
                if %w[degrees deg o].include?(angles[1])
                  (Math::PI / 180) * angles[0]
                elsif angles[1] == 'bp'
                  angles.first * (Math::PI / 180) * 35.9
                else
                  angles[0]
                end
              else
                angles[0]
              end
            else
              angles
            end
    axis /= Math.sqrt(axis.inner_product(axis))

    ct = Math.cos(angle)
    st = Math.sin(angle)
    olc = 1 - ct
    x = axis[0]
    y = axis[1]
    z = axis[2]

    Matrix[[olc * x * x + ct, olc * x * y - st * z, olc * x * z + st * y],
           [olc * x * y + st * z, olc * y * y + ct, olc * y * z - st * x],
           [olc * x * z - st * y, olc * y * z + st * x, olc * z * z + ct]]
  end

  def directional_change(v1, v2)
    max_of = 0
    max_dir = :X
    dir = 0

    if (v1[0] - v2[0]).abs > max_of
      max_of = (v1[0] - v2[0]).abs
      max_dir = :X
      dir = v1[0] - v2[0]
    elsif (v1[1] - v2[1]).abs > max_of
      max_of = (v1[1] - v2[1]).abs
      max_dir = :Y
      dir = v1[1] - v2[1]
    elsif (v1[2] - v2[2]).abs > max_of
      max_of = (v1[2] - v2[2]).abs
      max_dir = :Z
      dir = v1[2] - v2[2]
    end
    [max_dir, dir]
  end

  def directional_change_axis(v1, v2)
    axis = {}
    axis_count = 0
    dx = v1[0] - v2[0]
    dy = v1[1] - v2[1]
    dz = v1[2] - v2[2]
    if dx != 0
      axis[:X] = dx
      axis_count += dx.abs
    end

    if dy != 0
      axis[:Y] = dy
      axis_count += dy.abs
    end

    if dz != 0
      axis[:Z] = dz
      axis_count += dz.abs
    end
    axis.each do |ax|
      ax[1] /= axis_count
    end
    largest_delta_idx = axis.map { |e| e[1] }.each_with_index.max[1]
    [axis, largest_delta_idx]
  end
end
