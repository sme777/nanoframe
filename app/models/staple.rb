# frozen_string_literal: true

class Staple
  attr_accessor :sequence, :front, :back, :type, :next, :prev, :points, :interpolated_points, :scaffold_idxs, :complementary_rotation_labels

  def initialize(args)
    setup_dimensions([50, 50, 50], 5, :cube)
    if args.size == 3
      @sequence = args[:sequence]
      @points = args[:points]
    else
      @front = args[:front]
      @back = args[:back]
      @buffer = args[:buffer] || 0
      @type = args[:type]
      
      start_pos = args[:start_pos]
      end_pos = args[:end_pos]
      @next = nil
      @prev = nil
  

      if @front == @back
        @sequence = convert(front.sequence[start_pos...end_pos])
        @scaffold_idxs = front.scaffold_idxs[start_pos...end_pos]
        @complementary_rotation_labels = front.complementary_rotation_labels[start_pos...end_pos]
      else
        @sequence = convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
        @scaffold_idxs = front.scaffold_idxs[start_pos...] + [nil] * @buffer + back.scaffold_idxs[...end_pos]
        @complementary_rotation_labels = front.complementary_rotation_labels[start_pos...] + [nil] * @buffer + back.complementary_rotation_labels[...end_pos]
      end

      # @sequence = if front == back
      #               convert(front.sequence[start_pos...end_pos])
      #             else
      #               convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
      #             end
      # @scaffold_idxs = if front == back
      #                   front.scaffold_idxs[start_pos...end_pos] #+ [nil] * @buffer
      #                 else
      #                   front.scaffold_idxs[start_pos...] + [nil] * @buffer + back.scaffold_idxs[...end_pos]
      #                 end
      @points = compute_positions(start_pos, end_pos)
    end
  end

  def setup_dimensions(dimensions, segments, shape)
    case shape
    when :cube
      @width = dimensions[0]
      @height = dimensions[1]
      @depth = dimensions[2]
      @segments = segments
    when :tetrahedron
      @radius = dimensions[0]
    end
  end

  def convert(edge_seq)
    sequence = ''
    seq = edge_seq.split('')
    seq.each do |base|
      sequence += Staple.complementary_bp[base.to_sym]
    end
    sequence
  end

  def buffer_bp
    bpb = ''
    @buffer.times do |_i|
      bpb += Staple.complementary_bp.keys.sample.to_s
    end
    bpb
  end

  def compute_positions(start_pos, end_pos, extendable=nil, _sample = 10)
    if @type == :extension
      dr_ch, dr_vec = @front.directional_change_vec
      points = Vertex.linspace(dr_ch, @front.sequence.size, @front.v1, @front.v2)[start_pos...end_pos]
    elsif @type == :reflection || @type == :refraction || @type == :extension
      dr_ch, dr_vec = @front.directional_change_vec
      start_mid_vec = Vertex.new(@front.v1.x, @front.v1.y, @front.v1.z)
      start_mid_vec.instance_variable_set("@#{dr_ch}",
                                          @front.v1.instance_variable_get("@#{dr_ch}") - dr_vec * (start_pos.to_f / @front.sequence.size))
      start_point = start_mid_vec

      dr_ch2, dr_vec2 = @back.directional_change_vec

      end_mid_vec = Vertex.new(@back.v1.x, @back.v1.y, @back.v1.z)
      end_mid_vec.instance_variable_set("@#{dr_ch2}",
                                        @back.v1.instance_variable_get("@#{dr_ch2}") - dr_vec2 * (end_pos.to_f / @back.sequence.size))
      end_point = end_mid_vec

      points = []
      points.concat(Vertex.linspace(dr_ch, (@front.sequence.size - start_pos), start_point, @front.v2))
      points.concat(Vertex.linspace(dr_ch2, end_pos, @back.v1, end_point)[1...])
      adjust(points)
    end


  end

  def update_extendable_staples
    extendable_start = @complementary_rotation_labels.first < 6
    extendable_end = @complementary_rotation_labels.last < 6
    extendable = nil
    if extendable_start
      extendable = :start
    elsif extendable_end
      extendable = :end
    end

    extention_points = []
    if extendable == :start
      extention_points = compute_extension_positions(@points.first)
      @points = extention_points.concat(@points)
    elsif extendable == :end
      extention_points = compute_extension_positions(@points.last)
      @points = @points.concat(extention_points)
    end
    
  end

  def compute_extension_positions(point)
    side = find_side(point, point)
    case side
    when :S1
      Vertex.linspace(:z, 6, point, Vertex.new(point.x, point.y, point.z + 3))[1...]
    when :S2
      Vertex.linspace(:z, 6, point, Vertex.new(point.x, point.y, point.z - 3))[1...]
    when :S3
      Vertex.linspace(:y, 6, point, Vertex.new(point.x, point.y - 3, point.z))[1...]
    when :S4
      Vertex.linspace(:y, 6, point, Vertex.new(point.x, point.y + 3, point.z))[1...]
    when :S5
      Vertex.linspace(:x, 6, point, Vertex.new(point.x - 3, point.y, point.z))[1...]
    when :S6
      Vertex.linspace(:x, 6, point, Vertex.new(point.x + 3, point.y, point.z))[1...]
    else
      []
    end
  end

  def self.complementary_bp
    {
      "A": 'T',
      "T": 'A',
      "G": 'C',
      "C": 'G'
    }
  end

  def find_side(v1, v2)
    if v1.z == 0 && v2.z == 0
      side = :S1
    elsif v1.z == -@depth && v2.z == -@depth
      side = :S2
    elsif v1.y == 0 && v2.y == 0
      side = :S3
    elsif v1.y == @height && v2.y == @height
      side = :S4
    elsif v1.x == 0 && v2.x == 0
      side = :S5
    elsif v1.x == @width && v2.x == @width
      side = :S6
    else
      if v1.z == 0
        side = :S1
      elsif v1.z == -@depth
        side = :S2
      elsif v1.y == 0
        side = :S3
      elsif v1.y == @height
        side = :S4
      elsif v1.x == 0
        side = :S5
      elsif v1.x == @width
        side = :S6
      end
    end

  end

  def name
    starting_vertex = @front.v1
    ending_vertex = @back.v2
    side = find_side(starting_vertex, ending_vertex)
    hor, vert, hor_dist, vert_dist = nil, nil, nil, nil
    case side
    when :S1, :S2
      hor = "x"
      vert = "y"
      hor_dist = @width / @segments
      vert_dist = @height / @segments
    when :S3, :S4
      hor = "x"
      vert = "z"
      hor_dist = @width / @segments
      vert_dist = @depth / @segments
    when :S5, :S6
      hor = "z"
      vert = "y"
      hor_dist = @depth / @segments
      vert_dist = @height / @segments
    end
    row, col = row_and_col(hor, vert, hor_dist, vert_dist)
    "#{@type}-#{side}-R#{row}-C#{col}"
  end

  def adjust(points)
  
    if @type == :extension
      dir = @front.directional_change
      points.each { |p| p.instance_variable_set("@#{dir}", p.instance_variable_get("@#{dir}") + 0.5) }
    elsif @type == :refraction || @type == :reflection
      dir_front, dir_front_ch = @front.directional_change_vec
      dir_back, dir_back_ch = @back.directional_change_vec
      
      points.each do |p|
        cdr, cpe, cne = Routing.change_dir(dir_front, dir_back)
        dpe_dc, dne_dc = Routing.corner_change(cdr, cpe, cne, dir_front_ch, dir_back_ch)
        cpe_dc = p.instance_variable_get("@#{cpe}")
        cne_dc = p.instance_variable_get("@#{cne}")
        p.instance_variable_set("@#{cpe}", cpe_dc + dpe_dc)
        p.instance_variable_set("@#{cne}", cne_dc + dne_dc)
      end

    end
    points
  end

  def row_and_col(hor, vert, hor_dist, vert_dist)

    front_start_hor = @front.v1.instance_variable_get("@#{hor}")
    front_end_hor = @front.v2.instance_variable_get("@#{hor}")
    front_start_vert = @front.v1.instance_variable_get("@#{vert}")
    front_end_vert = @front.v2.instance_variable_get("@#{vert}")

    back_start_hor = @back.v1.instance_variable_get("@#{hor}")
    back_end_hor = @back.v2.instance_variable_get("@#{hor}")
    back_start_vert = @back.v1.instance_variable_get("@#{vert}")
    back_end_vert = @back.v2.instance_variable_get("@#{vert}")

    if @type == :reflection
      row, col = nil, nil
      if front_start_hor > back_end_hor
        if front_start_vert > back_end_vert
          if @front.directional_change == hor.to_sym
            row = (front_start_vert / hor_dist).abs.floor
            col = (front_start_hor / vert_dist).abs.floor
          else
            row = (front_start_vert / hor_dist).abs.floor
            col = (back_start_hor / vert_dist).abs.floor
          end
        else
          if @front.directional_change == hor.to_sym
            row = (back_end_vert / hor_dist).abs.floor
            col = (front_start_hor / vert_dist).abs.floor
          else
            row = (back_start_vert / hor_dist).abs.floor
            col = (front_start_hor / vert_dist).abs.floor
          end

        end
      else
        if front_start_vert > back_end_vert
          if @front.directional_change == hor.to_sym
            row = (front_start_vert / hor_dist).abs.floor 
            col = (back_start_hor / vert_dist).abs.floor
          else
            row = (front_start_vert / hor_dist).abs.floor 
            col = (back_end_hor / vert_dist).abs.floor
          end
        else
          if @front.directional_change == hor.to_sym
            row = (back_end_vert / hor_dist).abs.floor
            col = (back_end_hor / vert_dist).abs.floor
          else
            row = (back_end_vert / hor_dist).abs.floor
            col = (back_end_hor / vert_dist).abs.floor
          end

        end
      end
    elsif @type == :refraction
      if front_start_vert.abs == hor_dist * @segments || front_end_vert.abs == hor_dist * @segments
        row = @segments
        col = (front_start_hor / vert_dist).abs.floor
      elsif front_start_vert == 0 || front_end_vert == 0
        row = 1
        col = (front_start_hor / vert_dist).abs.floor
      elsif front_start_hor.abs == vert_dist * @segments || front_end_hor.abs == vert_dist * @segments
        row = (front_start_vert / hor_dist).abs.floor
        col = @segments
      elsif front_start_hor == 0 || front_end_hor == 0
        row = (front_start_vert / hor_dist).abs.floor
        col = 1
      end
      
    else
      row = (front_start_vert / hor_dist).abs.floor + 1
      col = (front_start_hor / vert_dist).abs.floor + 1
    end
    row = 1 if row == 0
    col = 1 if row == 0

    [row, col]
  end
end
