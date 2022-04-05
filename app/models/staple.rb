# frozen_string_literal: true

class Staple
  attr_accessor :sequence, :front, :back, :type, :next, :prev, :linear_points, :interpolated_points

  def initialize(front, back, start_pos, end_pos, type, buffer = 0)
    @front = front
    @back = back
    @buffer = buffer
    @type = type
    @next = nil
    @prev = nil
    @sequence = if front == back
                  convert(front.sequence[start_pos...end_pos] + buffer_bp)
                else
                  convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
                end
    @linear_points = compute_positions(start_pos, end_pos)
    @interpolated_points = interpolate_positions(@linear_points)
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
      start_mid_vec = Vertex.new(@front.v1.x, @front.v1.y, @front.v1.z)
      start_mid_vec.instance_variable_set("@#{dr_ch}",
                                          @front.v1.instance_variable_get("@#{dr_ch}") + dr_vec * (start_pos.to_f / @front.sequence.size))
      start_point = dr_vec < 0 ? @front.v1 - start_mid_vec : @front.v1 + start_mid_vec

      end_mid_vec = Vertex.new(front.v1.x, front.v1.y, front.v1.z)
      end_mid_vec.instance_variable_set("@#{dr_ch}",
                                        front.v1.instance_variable_get("@#{dr_ch}") + dr_vec * (end_pos.to_f / front.sequence.size))
      end_point = dr_vec < 0 ? front.v1 - end_mid_vec : front.v1 + end_mid_vec

      Vertex.linspace(dr_ch, (start_pos - end_pos).abs, start_point, end_point)

    elsif @type == :reflection || @type == :refraction
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
    builder = @type.to_s
    starting_vertex = @front.v1
    ending_vertex = @back.v2

    if starting_vertex.z == 0 && ending_vertex.z == 0
      builder += 'S1-'
    elsif starting_vertex.z == -@depth && ending_vertex.z == -@depth
      builder += 'S2-'
    elsif starting_vertex.y == 0 && ending_vertex.y == 0
      builder += 'S3-'
    elsif starting_vertex.y == @height && ending_vertex.y == @height
      builder += 'S4-'
    elsif starting_vertex.x == 0 && ending_vertex.x == 0
      builder += 'S5-'
    elsif starting_vertex.x == @width && ending_vertex.z == @width
      builder += 'S6-'
    end

    row, col = row_and_col
    builder += 'R' + row + '-' + 'C' + col
  end

  def adjust(points)
    if @type == :xyz
      dir_front = @front.directional_change
      dir_back = @back.directional_change
      points.each { |p| p.instance_variable_set("@#{dir_front}", p.instance_variable_get("@#{dir_front}") + 0.5) }
      points.each { |p| p.instance_variable_set("@#{dir_back}", p.instance_variable_get("@#{dir_back}") + 0.5) }
    elsif @type == :extension
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

  def row_and_col; end
end
