require 'matrix'

class OxDNAMaker
    CM_CENTER_DS = 0.2
    BASE_BASE = 0.3897628551303122


    def generate(sequence, start_pos=Vector[0,0,0], dir=Vector[0, 0, 1], perp=false, rot=0.0)
        positions = []
        a1s = []
        a3s = []
        start_pos = start_pos
        dir = dir

        dir_norm = Math.sqrt(dir.inner_product(dir))
        
        if !perp
            v1 = Vector[rand, rand, rand]
            v1 -= dir * dir.inner_product(v1)
            v1 /= Math.sqrt(v1.inner_product(v1))
        else
            v1 = perp
        end
        r0 = rotation_matrix(dir, rot)
        r = rotation_matrix(dir, [1, 'bp'])

        a1 = v1
        a1 = r0 * a1
        rb = start_pos
        a3 = dir

        sequence.split("").each_with_index do |bp, idx|
            rcdm = rb - CM_CENTER_DS * a1
            positions << rcdm
            a1s << a1
            a3s << a3

            if idx != sequence.size - 1
                a1 = r * a1
                rb += a3 * BASE_BASE
            end
        end

        [positions, a1s, a3s]
    end

    def rotation_matrix(axis, angles)
        if angles.kind_of?(Array)
            if angles.size > 1
                if ["degrees", "deg", "o"].include?(angles[1])
                    angle = (Math::PI / 180) * angles[0]
                elsif angles[1] == "bp"
                    angle = (angles.first * (Math::PI / 180) * (35.9)).to_i
                else
                    angle = angles[0]
                end
            else
                angle = angles[0]
            end
        else
            angle = angles
        end
        # angle = angles
        # axis = Vector[axis]
        axis /= Math.sqrt(axis.inner_product(axis))

        ct = Math.cos(angle)
        st = Math.sin(angle)
        olc = 1 - ct
        x, y, z = axis[0], axis[1], axis[2]

        Matrix[[olc*x*x+ct, olc*x*y-st*z, olc*x*z+st*y],
                [olc*x*y+st*z, olc*y*y+ct, olc*y*z-st*x],
                [olc*x*z-st*y, olc*y*z+st*x, olc*z*z+ct]]

    end

end