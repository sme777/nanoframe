# frozen_string_literal: true

class Staple
  attr_accessor :sequence, :front, :back, :type, :points

  def initialize(front, back, start_pos, end_pos, type, buffer = 0)
    @front = front
    @back = back
    @buffer = buffer
    @type = type
    @sequence = if front == back
                  convert(front.sequence[start_pos...end_pos] + buffer_bp)
                else
                  convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
                end
    @points = compute_positions(start_pos, end_pos)
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

  def compute_positions(start_pos, end_pos, sample=10)
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
      
      points = Vertex.linspace(dr_ch, (start_pos-end_pos).abs, start_point, end_point)
      points
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
      byebug
      # refl_front_points = Vertex.linspace(dr_ch, (@front.sequence.size-start_pos)/2, start_point, @front.v2)
      # front_spline = CatmullRomCurve3.new(refl_front_points)
      # points.concat(Vertex.flatten(front_spline.generate(@front.sequence.size-start_pos)))
      points.concat(Vertex.linspace(dr_ch, (@front.sequence.size-start_pos)/2, start_point, @front.v2))
      # refl_back_points = Vertex.linspace(dr_ch2, end_pos, @back.v1, end_point)
      # back_spline = CatmullRomCurve3.new(refl_back_points)
      points.concat(Vertex.linspace(dr_ch2, end_pos, @back.v1, end_point)[1...])
      curve = CatmullRomCurve3.new(points)
      curve.generate(2)
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
end
