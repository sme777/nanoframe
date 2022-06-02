require 'matrix'

class OxDNAMaker
    POS_BASE = 0.4
    CM_CENTER_DS = POS_BASE + 0.2
    BASE_BASE = 0.3897628551303122

    def setup(positions, staples_idxs)
        positions = group_positions(positions)[...60]
        scaffold_positions, scaffold_a1s, scaffold_a3s = [], [], []
        scaffold_nt_hash = {}
        staples_positions, staples_a1s, staples_a3s = [], [], []

        dir_X = Vector[1, 0, 0]
        dir_Y = Vector[0, 1, 0]
        dir_Z = Vector[0, 0, 1]
        rot = 0.0

        # r0_X = rotation_matrix(dir_X, rot)
        r_X = rotation_matrix(dir_X, [1, "bp"])
        # r0_Y = rotation_matrix(dir_Y, rot)
        r_Y = rotation_matrix(dir_Y, [1, "bp"])
        # r0_Z = rotation_matrix(dir_Z, rot)
        r_Z = rotation_matrix(dir_Z, [1, "bp"])
        r0 = Matrix.identity(3)

        dir_axis, largest_delta_idx = directional_change_axis(positions[1], positions[0])
        dir_axis_prv, largest_delta_prv_idx = dir_axis, largest_delta_idx
        dir_ch, dir_vec = directional_change(positions[1], positions[0])
        dir_ch_prv = dir_ch
        a1 = nil
        
        # a3 = Vector[0, 0, 0]
        # curr_R = Matrix.zero(3, 3)
        # dir_axis.each do |ax|
        #     a3 += binding.local_variable_get("dir_#{ax[0]}") * ax[1]
        #     curr_R += binding.local_variable_get("r_#{ax[0]}") * ax[1].abs
        # end
        # # a3 = a3.normalize

        a3 = dir_vec <= 0 ? binding.local_variable_get("dir_#{dir_ch}") : -binding.local_variable_get("dir_#{dir_ch}")
        rb = nil

        curr_R0 = r0 #binding.local_variable_get("r0_#{dir_ch}")
        curr_R = binding.local_variable_get("r_#{dir_ch}")
        # curr_a3 = a3
        # byebug
        
        scaffold_nts_hash = {}
        # byebug
        positions.each_with_index do |pos, idx|
            
            # dir_ch_prv, _ = directional_change(positions[idx-1], positions[idx-2]) if idx != 0
            # dir_ch, dir_vec = directional_change(positions[idx], positions[idx-1]) if idx != 0
            dir_axis, largest_delta_idx = directional_change_axis(positions[idx], positions[idx-1]) unless idx < 1
            dir_axis_prv, largest_delta_prv_idx = directional_change_axis(positions[idx - 1], positions[idx-2]) unless idx < 2
            dir_ch_prv, _ = directional_change(positions[idx-1], positions[idx-2]) if idx != 0
            dir_ch, dir_vec = directional_change(positions[idx], positions[idx-1]) if idx != 0
            # if idx == 25
            #     byebug
                
            # end

            # if dir_axis.sort != dir_axis_prv.sort
            #     a1 = nil
            # end

            if idx != 0
            # if dir_axis.sort != dir_axis_prv.sort #dir_axis[largest_delta_idx][0] != dir_axis_prv[largest_delta_prv_idx][0]
                # byebug
                # a1 = nil
                a3 = Vector[0, 0, 0]
                curr_R = Matrix.identity(3)
                sub_vec = Vertex.new(
                    positions[idx][0] - positions[idx-1][0], 
                    positions[idx][1] - positions[idx-1][1],
                    positions[idx][2] - positions[idx-1][2]
                    )
                euler_angles = sub_vec.euler_angles
                dir_axis.each_with_index do |ax, i|
                    a3 += binding.local_variable_get("dir_#{ax[0]}") * ax[1]
                end
                    # curr_R *= rotation_matrix(binding.local_variable_get("dir_#{dir_ch}"), [euler_angles[i], "bp"]) #binding.local_variable_get("r_#{ax[0]}") * ax[1].abs
                # end
                # byebug
                euler_angles.each_with_index do |e, i|
                    if 1 - e < 10e-5
                        euler_angles[i] = 1
                    end

                    if e < 10e-5
                        euler_angles[i] = 0
                    end
                end
                curr_R = (rotation_matrix(dir_Z, [euler_angles[2], "bp"]) * rotation_matrix(dir_Y, [euler_angles[1], "bp"])) * rotation_matrix(dir_X, [euler_angles[0], "bp"])
                # col1_R = curr_R.column(0).normalize
                # col2_R = curr_R.column(1).normalize
                # col3_R = curr_R.column(2).normalize
                # curr_R = Matrix[col1_R, col2_R, col3_R]
                a3 = a3.normalize
                # a1 = curr_R * a1
                # curr_R0 = binding.local_variable_get("r0_#{dir_ch}")
                # curr_R = binding.local_variable_get("r_#{dir_ch}")
                # a3 = dir_vec >= 0 ? binding.local_variable_get("dir_#{dir_ch}") : -binding.local_variable_get("dir_#{dir_ch}")
                # is_y = dir_ch != :Y ? false : true
            end
            position, a1, a3, rb, position_d, a1_d, a3_d = generate(Vector[pos[0], pos[1], pos[2]], a3, curr_R, r0, a1, a3, rb)
            scaffold_positions << position
            scaffold_a1s << a1
            scaffold_a3s << a3
            scaffold_nt_hash[idx+1] = [position_d, a1_d, a3_d]
        end
        # staples_idxs.each do |staple_idxs|
        #     staple_positions, staple_a1s, staple_a3s = [], [], []
        #     staple_idxs.each do |idx|
        #         next if idx.nil?
                
        #         complimentary_data = scaffold_nt_hash[idx]
        #         staple_positions << complimentary_data[0]
        #         staple_a1s << complimentary_data[1]
        #         staple_a3s << complimentary_data[2]
        #     end
        #     staples_positions << staple_positions
        #     staples_a1s << staple_a1s
        #     staples_a3s << staple_a3s
        # end


        [scaffold_positions, scaffold_a1s, scaffold_a3s, staples_positions, staples_a1s, staples_a3s]
    end
    ### TODO fix repeated points in graph.rb
    def group_positions(positions)
        return positions unless positions[0].is_a? Numeric

        new_positions = []
        i = 0
        while i < positions.size
            new_positions << [positions[i], positions[i+1], positions[i+2]]
            if i + 5 > positions.size - 1
                i += 3
                next
            end

            if positions[i] == positions[i+3] && positions[i+1] == positions[i+4] && positions[i+2] == positions[i+5]
                i += 6
            else
                i += 3
            end
        end
        new_positions
    end

    def generate(start_pos, dir, r, r0, a1=nil, a3=nil, rb=nil)
        start_pos_d = start_pos

        if a1.nil?
            v1 = Vector[rand, rand, rand]
            v1 -= dir * dir.inner_product(v1)
            v1 /= Math.sqrt(v1.inner_product(v1))
            a1 = v1
            a1 = r0 * a1
            rb = start_pos
            a3 = dir
        else
            start_pos = (rb - CM_CENTER_DS * a1)
            a1 = r * a1
            rb += a3 * BASE_BASE
        end
        a1_d = -a1
        a3_d = -a3
        start_pos_d = (rb - CM_CENTER_DS * a1_d)

        [start_pos, a1, a3, rb, start_pos_d, a1_d, a3_d]
    end

    def rotation_matrix(axis, angles)
        if angles.kind_of?(Array)
            if angles.size > 1
                if ["degrees", "deg", "o"].include?(angles[1])
                    angle = (Math::PI / 180) * angles[0]
                elsif angles[1] == "bp"
                    angle = angles.first * (Math::PI / 180) * (35.9)
                else
                    angle = angles[0]
                end
            else
                angle = angles[0]
            end
        else
            angle = angles
        end
        axis /= Math.sqrt(axis.inner_product(axis))

        ct = Math.cos(angle)
        st = Math.sin(angle)
        olc = 1 - ct
        x, y, z = axis[0], axis[1], axis[2]

        Matrix[[olc*x*x+ct, olc*x*y-st*z, olc*x*z+st*y],
                [olc*x*y+st*z, olc*y*y+ct, olc*y*z-st*x],
                [olc*x*z-st*y, olc*y*z+st*x, olc*z*z+ct]]

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
        axis = []
        axis_count = 0
        dx = v1[0] - v2[0]
        dy = v1[1] - v2[1]
        dz = v1[2] - v2[2]
        if dx != 0
            axis << [:X, dx]
            axis_count += dx.abs
        end
        
        if dy != 0
            axis << [:Y, dy]
            axis_count += dy.abs
        end

        if dz != 0
            axis << [:Z, dz]
            axis_count += dz.abs
        end
        axis.each do |ax|
            ax[1] /= axis_count 
        end
        largest_delta_idx = axis.map {|e| e[1]}.each_with_index.max[1]
        [axis, largest_delta_idx]
    end

end