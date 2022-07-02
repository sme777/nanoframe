# frozen_string_literal: true

class Staple
  attr_accessor :sequence, :front, :back, :type, :next, :prev, :points, :interpolated_points, :scaffold_idxs,
                :complementary_rotation_labels, :buffer, :starting_vertex, :ending_vertex, :original_points

  def initialize(args)
    # setup_dimensions([], 5, :cube)
    if args[:clone]
      @sequence = args[:sequence]
      @points = args[:points]
      @original_points = args[:original_points]
      @scaffold_idxs = args[:scaffold_idxs]
      @complementary_rotation_labels = args[:complementary_rotation_labels]
      @buffer = args[:buffer]
      @front = args[:front]
      @back = args[:back]
      @type = args[:type]
      @graph = args[:graph]
      @starting_vertex = @points.first
      @ending_vertex = @points.last
    else
      @front = args[:front]
      @back = args[:back]
      @buffer = args[:buffer] || 0
      @type = args[:type]
      @graph = args[:graph]
      start_pos = args[:start_pos]
      end_pos = args[:end_pos]
      @next = nil
      @prev = nil
      @starting_vertex = nil
      @ending_vertex = nil

      # buffer_type = type == :refraction
      if @front == @back
        @sequence = convert(front.sequence[start_pos...end_pos])
        @scaffold_idxs = front.scaffold_idxs[start_pos...end_pos]
        @complementary_rotation_labels = front.complementary_rotation_labels[start_pos...end_pos]
      # elsif front.scaffold_idxs.include?(7248) && back.scaffold_idxs.include?(0)
      #   # provide loopout length for dynamic length configuration
      #   @sequence = convert(front.sequence[start_pos...start_pos + 15] + buffer_bp + back.sequence[...end_pos])
      #   @scaffold_idxs = front.scaffold_idxs[start_pos...start_pos + 15] + ['skip'] * @buffer + back.scaffold_idxs[...end_pos]
      #   @complementary_rotation_labels = front.complementary_rotation_labels[start_pos...start_pos + 15] + [nil] * @buffer + back.complementary_rotation_labels[...end_pos]
      else
        # byebug if front.sequence[start_pos...].nil? || back.sequence[...end_pos].nil?
        # corner_nt_idx = type == :refraction ? -2 : -1
        @sequence = convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
        @scaffold_idxs = front.scaffold_idxs[start_pos...] + ['skip'] * @buffer + back.scaffold_idxs[...end_pos]
        @complementary_rotation_labels = front.complementary_rotation_labels[start_pos...] + [nil] * @buffer + back.complementary_rotation_labels[...end_pos]
      end

      @original_points = compute_positions(start_pos, end_pos)
      @points = adjust(Utils.deep_copy(@original_points))
    end
  end

  # def setup_dimensions(dimensions, segments, shape)
  #   case shape
  #   when :cube
  #     @width = dimensions[0]
  #     @height = dimensions[1]
  #     @depth = dimensions[2]
  #     @segments = segments
  #   when :tetrahedron
  #     @radius = dimensions[0]
  #   end
  # end

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

  def compute_positions(start_pos, end_pos, _extendable = nil, _sample = 10)
    dr_ch, dr_vec = @front.directional_change_vec
    start_mid_vec = Vertex.new(@front.v1.x, @front.v1.y, @front.v1.z)
    adj_start_seq = @front.scaffold_idxs.include?(7248) ? 30 : @front.sequence.size
    start_mid_vec.instance_variable_set("@#{dr_ch}",
                                        @front.v1.instance_variable_get("@#{dr_ch}") - dr_vec * (start_pos.to_f / adj_start_seq))
    start_point = start_mid_vec
    @starting_vertex = start_mid_vec
    dr_ch2, dr_vec2 = @back.directional_change_vec

    end_mid_vec = Vertex.new(@back.v1.x, @back.v1.y, @back.v1.z)
    adj_back_seq = @back.scaffold_idxs.include?(7248) ? 30 : @back.sequence.size
    end_mid_vec.instance_variable_set("@#{dr_ch2}",
                                      @back.v1.instance_variable_get("@#{dr_ch2}") - dr_vec2 * (end_pos.to_f / adj_back_seq))
    end_point = end_mid_vec
    @ending_vertex = end_mid_vec
    points = []
    if @front.scaffold_idxs.include?(7248)
      points.concat(Vertex.linspace(dr_ch, (15 + @buffer), start_point, @front.v2))
    else
      points.concat(Vertex.linspace(dr_ch, (@front.sequence.size - start_pos + @buffer), start_point, @front.v2))
    end

    points.concat(Vertex.linspace(dr_ch2, end_pos + 1, @back.v1, end_point)[1...])
  end

  def update_interior_extension
    return if @type == :refraction || @type == :mod_refraction

    extendable_start = @complementary_rotation_labels.first.nil? || @complementary_rotation_labels.first >= 5
    extendable_end = @complementary_rotation_labels.last.nil? || @complementary_rotation_labels.last >= 5
    extendable = nil

    if extendable_start
      extension_points = compute_extension_positions(@points.first, -1)
      @points = extension_points + @points
      @scaffold_idxs = ['ein'] * extension_points.size + @scaffold_idxs
      @sequence = 'A' * extension_points.size + @sequence

    elsif extendable_end
      extension_points = compute_extension_positions(@points.last, -1)
      @points += extension_points
      @scaffold_idxs += ['ein'] * extension_points.size
      @sequence += 'A' * extension_points.size
    end
  end

  def update_exterior_extension(extension_side)
    case extension_side
    when :start
      orth, side = Plane.orthogonal_dimension(@original_points[1], @original_points[1])
      extension_points = compute_outer_extension_positions(@points[0], orth, side)
      original_extension_points = compute_outer_extension_positions(@original_points[0], orth, side)
      @points = extension_points + @points
      @original_points = original_extension_points + @original_points
      @scaffold_idxs = ['eout'] * extension_points.size + @scaffold_idxs
      @complementary_rotation_labels = [nil] * extension_points.size + @complementary_rotation_labels
      @sequence = 'T' * extension_points.size + @sequence
    when :end
      orth, side = Plane.orthogonal_dimension(@original_points[-2], @original_points[-2])
      extension_points = compute_outer_extension_positions(@points[-1], orth, side)
      original_extension_points = compute_outer_extension_positions(@original_points[-1], orth, side)
      @points += extension_points
      @original_points += original_extension_points
      @scaffold_idxs += ['eout'] * extension_points.size
      @complementary_rotation_labels += [nil] * extension_points.size
      @sequence += 'T' * extension_points.size
    end
  end

  def find_corner_vertex
    @original_points.each_with_index do |point, idx|
      count = 0
      count += 1 if point.x.zero? || point.x == @graph.width

      count += 1 if point.y.zero? || point.y == @graph.height

      count += 1 if point.z.abs.zero? || point.z.abs == @graph.depth

      return [point, idx] if count == 2
    end
    [nil, nil]
  end

  def rounded_vertex(v)
    rounded_x = v.x.abs.floor.zero? ? 0 : v.x
    rounded_y = v.y.abs.floor.zero? ? 0 : v.y
    rounded_z = v.z.abs.floor.zero? ? 0 : v.z
    rounded_point = Vertex.new(rounded_x, rounded_y, rounded_z)
  end

  def compute_outer_extension_positions(point, orth, side)
    points = []
    case orth
    when :x
      byebug if side != :S5 && side != :S6
      dir = side == :S5 ? -1 : 1
      points = Vertex.linspace(:x, 11, point, Vertex.new(point.x + 3 * dir, point.y, point.z))[1...]
    when :y
      byebug if side != :S3 && side != :S4
      dir = side == :S3 ? -1 : 1
      points = Vertex.linspace(:y, 11, point, Vertex.new(point.x, point.y + 3 * dir, point.z))[1...]
    when :z
      byebug if side != :S1 && side != :S2
      dir = side == :S2 ? -1 : 1
      points = Vertex.linspace(:z, 11, point, Vertex.new(point.x, point.y, point.z + 3 * dir))[1...]
    end
    points
  end

  def compute_extension_positions(point, dir)
    rounded_point = rounded_vertex(point)
    side = Routing.find_plane_number(rounded_point, rounded_point, [@graph.width, @graph.height, @graph.depth])
    case side
    when :S1
      Vertex.linspace(:z, 11, point, Vertex.new(point.x, point.y, point.z + 3 * dir))[1...]
    when :S2
      Vertex.linspace(:z, 11, point, Vertex.new(point.x, point.y, point.z - 3 * dir))[1...]
    when :S3
      Vertex.linspace(:y, 11, point, Vertex.new(point.x, point.y - 3 * dir, point.z))[1...]
    when :S4
      Vertex.linspace(:y, 11, point, Vertex.new(point.x, point.y + 3 * dir, point.z))[1...]
    when :S5
      Vertex.linspace(:x, 11, point, Vertex.new(point.x - 3 * dir, point.y, point.z))[1...]
    when :S6
      Vertex.linspace(:x, 11, point, Vertex.new(point.x + 3 * dir, point.y, point.z))[1...]
    else
      []
    end
  end

  def self.complementary_bp
    {
      "A": 'T',
      "T": 'A',
      "G": 'C',
      "C": 'G',
      "Z": "Z"
    }
  end

  def name
    # byebug
    starting_vertex = @front.v1
    ending_vertex = @back.v2
    side = Routing.find_plane_number(starting_vertex, ending_vertex, [@graph.width, @graph.height, @graph.depth])
    hor = nil
    vert = nil
    hor_dist = nil
    vert_dist = nil
    case side
    when :S1, :S2
      hor = 'x'
      vert = 'y'
      hor_dist = @graph.width / @graph.segments
      vert_dist = @graph.height / @graph.segments
    when :S3, :S4
      hor = 'x'
      vert = 'z'
      hor_dist = @graph.width / @graph.segments
      vert_dist = @graph.depth / @graph.segments
    when :S5, :S6
      hor = 'z'
      vert = 'y'
      hor_dist = @graph.depth / @graph.segments
      vert_dist = @graph.height / @graph.segments
    end
    row, col = row_and_col(hor, vert, hor_dist, vert_dist)
    "#{@type}-#{side}-R#{row}-C#{col}"
  end

  def adjust(points)
    case @type
    when :extension
      dir = @front.directional_change
      points.each { |p| p.instance_variable_set("@#{dir}", p.instance_variable_get("@#{dir}") + 0.5) }
    when :reflection, :refraction
      dir_front, dir_front_ch = @front.directional_change_vec
      dir_back, dir_back_ch = @back.directional_change_vec

      points.each do |p|
        cdr, cpe, cne = Routing.change_dir(dir_front, dir_back)
        dpe_dc, dne_dc = Routing.corner_change(cdr, cpe, cne, dir_front_ch, dir_back_ch)
        cpe_dc = p.instance_variable_get("@#{cpe}")
        cne_dc = p.instance_variable_get("@#{cne}")
        dpe_dc = @type == :refraction ? -dpe_dc : dpe_dc
        dne_dc = @type == :refraction ? -dne_dc : dne_dc
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

    case @type
    when :reflection
      row = nil
      col = nil
      if front_start_hor > back_end_hor
        if front_start_vert > back_end_vert
          row = (front_start_vert / hor_dist).abs.floor
          col = if @front.directional_change == hor.to_sym
                  (front_start_hor / vert_dist).abs.floor
                else
                  (back_start_hor / vert_dist).abs.floor
                end
        else
          row = if @front.directional_change == hor.to_sym
                  (back_end_vert / hor_dist).abs.floor
                else
                  (back_start_vert / hor_dist).abs.floor
                end
          col = (front_start_hor / vert_dist).abs.floor

        end
      elsif front_start_vert > back_end_vert
        row = (front_start_vert / hor_dist).abs.floor
        col = if @front.directional_change == hor.to_sym
                (back_start_hor / vert_dist).abs.floor
              else
                (back_end_hor / vert_dist).abs.floor
              end
      else
        row = (back_end_vert / hor_dist).abs.floor
        if @front.directional_change == hor.to_sym
        end
        col = (back_end_hor / vert_dist).abs.floor

      end
    when :refraction
      if front_start_vert.abs == hor_dist * @graph.segments || front_end_vert.abs == hor_dist * @graph.segments
        row = @graph.segments
        col = (front_start_hor / vert_dist).abs.floor
      elsif front_start_vert.zero? || front_end_vert.zero?
        row = 1
        col = (front_start_hor / vert_dist).abs.floor
      elsif front_start_hor.abs == vert_dist * @graph.segments || front_end_hor.abs == vert_dist * @graph.segments
        row = (front_start_vert / hor_dist).abs.floor
        col = @graph.segments
      elsif front_start_hor.zero? || front_end_hor.zero?
        row = (front_start_vert / hor_dist).abs.floor
        col = 1
      end

    else
      row = (front_start_vert / hor_dist).abs.floor + 1
      col = (front_start_hor / vert_dist).abs.floor + 1
    end
    row = 1 if row.zero?
    col = 1 if row.zero?

    [row, col]
  end
end
