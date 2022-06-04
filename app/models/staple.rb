# frozen_string_literal: true

class Staple
  attr_accessor :sequence, :front, :back, :type, :next, :prev, :linear_points, :interpolated_points, :scaffold_idxs

  def initialize(args)
    
    if args.size == 3
      @sequence = args[:sequence]
      @linear_points = args[:linear_points]
      @interpolated_points = args[:interpolated_points]
    else
      @front = args[:front]
      @back = args[:back]
      @buffer = 0#args[:buffer] || 0
      @type = args[:type]
      
      start_pos = args[:start_pos]
      end_pos = args[:end_pos]
      @next = nil
      @prev = nil
  
      @sequence = if front == back
                    convert(front.sequence[start_pos...end_pos])
                  else
                    convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
                  end
      @scaffold_idxs = if front == back
                        front.scaffold_idxs[start_pos...end_pos] #+ [nil] * @buffer
                      else
                        front.scaffold_idxs[start_pos...] + [nil] * @buffer + back.scaffold_idxs[...end_pos]
                      end
      @linear_points = compute_positions(start_pos, end_pos)
      @interpolated_points = interpolate_positions(@linear_points)
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

  def compute_positions(start_pos, end_pos, _sample = 10)
    if @type == :extension
      dr_ch, dr_vec = @front.directional_change_vec
      points = Vertex.linspace(dr_ch, @front.sequence.size, @front.v1, @front.v2)[start_pos...end_pos]
      # byebug
      
      # start_mid_vec = Vertex.new(0, 0, 0)
      # start_mid_vec.instance_variable_set("@#{dr_ch}",
      #                                     @front.v1.instance_variable_get("@#{dr_ch}") - dr_vec * (start_pos.to_f / @front.sequence.size))
      # start_point = dr_vec < 0 ? @front.v1 - start_mid_vec : @front.v1 + start_mid_vec

      # end_mid_vec = Vertex.new(0, 0, 0)
      # end_mid_vec.instance_variable_set("@#{dr_ch}",
      #                                   @front.v1.instance_variable_get("@#{dr_ch}") - dr_vec * (end_pos.to_f / @front.sequence.size))
      # end_point = dr_vec < 0 ? @front.v1 - end_mid_vec : @front.v1 + end_mid_vec

      # points = Vertex.linspace(dr_ch, (start_pos - end_pos).abs, start_point, end_point)
      # points
      # adjust(points)
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
      # byebug

      points.concat(Vertex.linspace(dr_ch, (@front.sequence.size - start_pos), start_point, @front.v2))
      points.concat(Vertex.linspace(dr_ch2, end_pos, @back.v1, end_point)[1...])
      adjust(points)
      # curve = CatmullRomCurve3.new(points)
      # curve.generate(2)
    end
  end

  def interpolate_positions(points)
    spline = CatmullRomCurve3.new(points, false)
    spline.generate(2)
  end

  def self.complementary_bp
    {
      "A": 'T',
      "T": 'A',
      "G": 'C',
      "C": 'G'
    }
  end

  def name
    # builder = "#{@type.to_s}-"
    starting_vertex = @front.v1
    ending_vertex = @back.v2
    side = "potato"

    if starting_vertex.z == 0 && ending_vertex.z == 0
      side = :S1
      # builder += 'S1-'
    elsif starting_vertex.z == -@depth && ending_vertex.z == -@depth
      side = :S2
      # builder += 'S2-'
    elsif starting_vertex.y == 0 && ending_vertex.y == 0
      side = :S3
      # builder += 'S3-'
    elsif starting_vertex.y == @height && ending_vertex.y == @height
      side = :S4
      # builder += 'S4-'
    elsif starting_vertex.x == 0 && ending_vertex.x == 0
      side = :S5
      # builder += 'S5-'
    elsif starting_vertex.x == @width && ending_vertex.x == @width
      side = :S6
      # builder += 'S6-'
    else
      if starting_vertex.z == 0
        side = :S1
      elsif starting_vertex.z == -@depth
        side = :S2
      elsif starting_vertex.y == 0
        side = :S3
      elsif starting_vertex.y == @height
        side = :S4
      elsif starting_vertex.x == 0
        side = :S5
      elsif starting_vertex.x == @width
        side = :S6
      end
    end

    row, col = row_and_col
    "#{@type}-#{side}-R#{row}-C#{col}"
    # builder += "R#{row}-C#{col}"
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

  def row_and_col
    side = Routing.find_plane_number(@front.v1, @front.v2, [50, 50, 50])
    dist2wseg = @width / @segments
    dist2hseg = @height / @segments
    dist2dseg = @depth / @segments
    case side
    when :S1, :S2
      if @type == :reflection
        edge_row = (@front.v1.y / dist2hseg).abs.floor + 1
        edge_col = (@front.v1.x / dist2wseg).abs.floor + 1

        front_dir, front_dir_ch = @front.directional_change_vec
        back_dir, back_dir_ch = @back.directional_change_vec

        if front_dir_ch > 0
          if back_dir_ch > 0
            col = edge_col - 1
            row = edge_row
          else
            col = edge_col - 1
            row = edge_row - 1
          end
        else
          if back_dir_ch > 0
            col = edge_col
            row = edge_row
          else
            col = edge_col
            row = edge_row - 1
          end
        end

      elsif @type == :refraction
        row = (@front.v1.y / dist2hseg).abs.floor + 1
        col = (@front.v1.x / dist2wseg).abs.floor + 1
      else
        row = (@front.v1.y / dist2hseg).abs.floor + 1
        col = (@front.v1.x / dist2wseg).abs.floor + 1
      end
    when :S3, :S4


      
      row = (@front.v1.z / dist2dseg).abs.ceil
      col = (@front.v1.x / dist2wseg).abs.ceil
    when :S5, :S6
      row = (@front.v1.y / dist2hseg).abs.ceil
      col = (@front.v1.z / dist2dseg).abs.ceil
    end
    [row, col]
  end
end
