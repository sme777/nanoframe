# frozen_string_literal: true
require 'ruby-cbc'

class Breaker
  SSDNA_NT_DIST = 0.332

  def initialize(id, dimensions, shape, segments, scaff_length)
    @shape = shape
    @generator_id = id
    @segments = segments
    @scaff_length = scaff_length
    setup_dimensions(dimensions, shape)
  end

  def setup_dimensions(dimensions, _shape)
    case @shape
    when :cube
      @width = dimensions[0]
      @height = dimensions[1]
      @depth = dimensions[2]

      @w_step = ((dimensions[0] / SSDNA_NT_DIST) / @segments).floor
      @h_step = ((dimensions[1] / SSDNA_NT_DIST) / @segments).floor
      @d_step = ((dimensions[2] / SSDNA_NT_DIST) / @segments).floor
    when :tetrahedron
      @radius = dimensions[0]
    end
  end

  # S1 = front; S2 = back; S3 = top; S4 = bottom; S5 = left; S6 = right
  def staples_preprocess(side)
    contraints = {}
    case @shape
    when :cube
      
      w_constraint = ((@width / @segments) / SSDNA_NT_DIST).floor >= 60
      h_constraint = ((@height / @segments) / SSDNA_NT_DIST).floor >= 60
      d_constraint = ((@depth / @segments) / SSDNA_NT_DIST).floor >= 60
      case side
      when :S1, :S2
        contraints[:z1] = w_constraint
        contraints[:z3] = w_constraint
        contraints[:z2] = h_constraint
        contraints[:z4] = h_constraint
      when :S3, :S4
        contraints[:z1] = w_constraint
        contraints[:z3] = w_constraint
        contraints[:z2] = d_constraint
        contraints[:z4] = d_constraint
      when :S5, :S6
        contraints[:z1] = d_constraint
        contraints[:z3] = d_constraint
        contraints[:z2] = h_constraint
        contraints[:z4] = h_constraint
      end
    when :tetrahedron

    end
    contraints
  end

  def staples_postprocess(arr)
    case @shape
    when :cube
      #   arr = [@ext_b_hor, @ext_b_vert, @ext_hor, @ext_vert]
      arr.each_with_index do |ext, i|
        if ext > 60
          broken_ext = break_long_extension(ext.to_f)
          broken_ext[broken_ext.length - 1] = broken_ext.last + 1 if ext.odd?
          arr[i] = broken_ext
        else
          arr[i] = [ext]
        end
      end
    when :tetrahedron

    end
    arr
  end

  def break_long_extension(length)
    # byebug
    return [(length / 2).floor, (length / 2).ceil] if length / 2 >= 20 && length / 2 <= 60

    break_long_extension(length / 2) * 2
  end

  def ilp(constraints, side)
    model = Cbc::Model.new
    s = @segments
    s2 = s**2
    x, y, x1, x2, z1, z2, z3, z4 = model.int_var_array(8, 0..Cbc::INF)
    model.maximize(2 * s2 * x + 4 * s * y + 2 * s * z1 + 2 * s * z2 + (s2 - s) * z3 + (s2 - s) * z4)
    h_step, v_step = step_size(side)


    # x, y mandatory restraints
    model.enforce(x >= 20)
    model.enforce(y >= 20)
    model.enforce(x <= 60)
    model.enforce(y <= 60)
    model.enforce(x1 + 0.5 * y + z1 >= h_step)
    model.enforce(x2 + 0.5 * y + z2 >= v_step)
    model.enforce(x1 + 0.5 * y + z1 <= h_step)
    model.enforce(x2 + 0.5 * y + z2 <= v_step)
    model.enforce(2 * x1 + z3 >= h_step)
    model.enforce(2 * x2 + z4 >= v_step)
    model.enforce(2 * x1 + z3 <= h_step)
    model.enforce(2 * x2 + z4 <= v_step)
    model.enforce(x1 + x2 >= x)
    model.enforce(x1 + x2 <= x)

    model.enforce(2 * s2 * x + 4 * s * y + 2 * s * z1 + 2 * s * z2 + (s2 - s) * z3 + (s2 - s) * z4 <= @scaff_length)
    # z1, z2, z3, z4 filtered restraints
    model.enforce(z1 >= 0)
    if constraints[:z1]
      model.enforce(z1 >= 20)
    else
      model.enforce(z1 <= 0)
    end

    model.enforce(z2 >= 0)
    if constraints[:z2]
      model.enforce(z2 >= 20)
    else
      model.enforce(z2 <= 0)
    end

    model.enforce(z3 >= 0)
    if constraints[:z3]
      model.enforce(z3 >= 20)
    else
      model.enforce(z3 <= 0)
    end

    model.enforce(z4 >= 0)
    if constraints[:z4]
      model.enforce(z4 >= 20)
    else
      model.enforce(z4 <= 0)
    end
    problem = model.to_problem
    Thread.new { problem.solve }.join
    [problem.value_of(x), problem.value_of(x1), problem.value_of(x2), problem.value_of(y), problem.value_of(z1),
     problem.value_of(z2), problem.value_of(z3), problem.value_of(z4)]
  end

  def generate_staple_strands(vertices, staple_len_map)

    edges = generate_shape_edges(vertices)
    staples = []

    edges.each do |edge|
      curr_side = edge_side(edge)
      refl, refl1, refl2, refr, ext_b_hor, ext_b_vert, ext_hor, ext_vert = staple_len_map[curr_side]
      refl = refl.first
      refl1 = refl1.first
      refl2 = refl2.first
      refr = refr.first

      if on_boundary?(edge.v2)
        adjacent = ObjectSpace._id2ref(edge.next)
        next_side = edge_side(adjacent)
        _, _, _, refr2, _, _, _, _ = staple_len_map[next_side]
        refr2 = refr2.first

        if ext_b_hor == [0] && ext_b_vert == [0]
          staple = Staple.new(edge, adjacent, refr / 2, refr2 / 2, :refraction, 2)
          edge.assoc_strands << staple.object_id
          staples << staple
        else
          dir_ch = edge.directional_change
          # byebug
          if (dir_ch == :x && ext_b_hor != [0]) ||
              (dir_ch == :y && ext_b_vert != [0]) ||
              (dir_ch == :z && ext_b_vert != [0] && (curr_side == :S3 || curr_side == :S4)) || 
              (dir_ch == :z && ext_b_hor != [0] && (curr_side == :S5 || curr_side == :S6))
              
            start = refl2
            case dir_ch
            when :x
              extension = ext_b_hor
            when :y
              extension = ext_b_vert
            when :z
              extensions = (curr_side == :S3 || curr_side == :S4) ? ext_b_vert : ext_b_hor
            end
            extension_staples = []
            extensions.each do |ext|
              staple = Staple.new(edge, edge, start, start + ext, :extension)
              edge.assoc_strands << staple.object_id
              extension_staples << staple
              start += ext
            end

            extension_staples.each_with_index do |stp, idx|
              # next unless stp != extension_staples.last || stp !
              if stp != extension_staples.last
                stp.next = extension_staples[idx + 1].object_id
              end
              if stp != extension_staples.first
                stp.prev = extension_staples[idx - 1].object_id
              end
            end
            # byebug
            staples.concat(extension_staples)

            staples << Staple.new(edge, adjacent, start, refr2 / 2, :refraction, 2)
          else
            staple = Staple.new(edge, adjacent, refr / 2, refr2 / 2, :reflection, 1)
            edge.assoc_strands << staple.object_id
            staples << staple
          end
        end
      else
        adjacent = ObjectSpace._id2ref(edge.adjacent_edges.first)
        if ext_hor == [0] && ext_vert == [0]
          staple = Staple.new(edge, adjacent, refl2, refl2, :reflection, 1)
          edge.assoc_strands << staple.object_id
          staples << staple
        else
          # byebug
          dir_ch = edge.directional_change
          if (dir_ch == :x && ext_hor != [0]) ||
            (dir_ch == :y && ext_vert != [0]) ||
            (dir_ch == :z && ext_vert != [0] && (curr_side == :S3 || curr_side == :S4)) || 
            (dir_ch == :z && ext_hor != [0] && (curr_side == :S5 || curr_side == :S6))
            # byebug
            start = refl2
            
            case dir_ch
            when :x
              extension = ext_hor
            when :y
              extension = ext_vert
            when :z
              extensions = (curr_side == :S3 || curr_side == :S4) ? ext_vert : ext_hor
            end

            # extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
            extension_staples = []
            extensions.each do |ext|
              # byebug
              staple = Staple.new(edge, edge, start, start + ext, :extension)
              edge.assoc_strands << staple.object_id
              extension_staples << staple
              start += ext
            end

            extension_staples.each_with_index do |stp, idx|
              if stp != extension_staples.last
                stp.next = extension_staples[idx + 1].object_id
              end
              if stp != extension_staples.first
                stp.prev = extension_staples[idx - 1].object_id
              end
            end
            
            staples.concat(extension_staples)
            staple = Staple.new(edge, adjacent, start, refl2, :reflection, 1)
            edge.assoc_strands << staple.object_id
            staples << staple
        
          else
            # byebug
            # cut_size = refl2 > 
            min_size = [refl1, refl2].min
            max_size = [refl1, refl2].max
            if edge.sequence.size < max_size
              staple = Staple.new(edge, adjacent, min_size, max_size, :reflection, 1)
            else
              staple = Staple.new(edge, adjacent, max_size, min_size, :reflection, 1)
            end
            
            edge.assoc_strands << staple.object_id
            staples << staple
          end
        end
      end
    end
    set_staple_neighbors(staples)
    [edges, staples]
  end

  def edge_side(edge)
    Routing.find_plane_number(edge.v1, edge.v2, [@width, @height, @depth])
  end

  def step_size(side)
    case @shape
    when :cube
      case side
      when :S1, :S2
        h_step = @w_step
        v_step = @h_step
      when :S3, :S4
        h_step = @w_step
        v_step = @d_step
      when :S5, :S6
        h_step = @d_step
        v_step = @h_step
      end
    end

    [h_step, v_step]
  end

  def set_staple_neighbors(staples)
    staples.each do |staple1|
      staples.each do |staple2|
        next unless staple1 != staple2

        if staple1.type == :extension

          if staple2.type == :reflection || staple2.type == :refraction
            # byebug
            if staple1.front == staple2.back
              # byebug
              staple1.next = staple2.object_id
            elsif staple1.back == staple2.front
              # byebug
              staple1.prev = staple2.object_id
            end
          end
        # works for only relfection-refraction pairs
        elsif staple1.type == :refraction || staple1.type == :reflection
          if staple1.front == staple2.back
            staple1.prev = staple2.object_id
          elsif staple1.back == staple2.front
            staple1.next = staple2.object_id
          end
        end
      end
    end
  end

  def update_boundary_strands(edges, staples)
    # byebug
    edges.each do |edge|
      edge.assoc_strands.each do |staple_id|
        staple = ObjectSpace._id2ref(staple_id)
        if staple.type == :reflection && staples.include?(staple)
          cutoff = (staple.sequence.size / 2 - 2) # 2 is the bridge length
          back_sequence = staple.sequence[...cutoff]
          front_sequence = staple.sequence[cutoff...]

          back_lin_positions = staple.linear_points[...cutoff]
          back_int_positions = staple.interpolated_points[...cutoff]
          front_lin_positions = staple.linear_points[cutoff...]
          front_int_positions = staple.interpolated_points[cutoff...]
          # back_lin_positions
          prev_staple = ObjectSpace._id2ref(staple.prev)
          next_staple = ObjectSpace._id2ref(staple.next)

          prev_staple.sequence = prev_staple.sequence + back_sequence
          prev_staple.linear_points = prev_staple.linear_points.concat(back_lin_positions)
          prev_staple.interpolated_points = prev_staple.interpolated_points.concat(back_int_positions)

          next_staple.sequence = front_sequence + next_staple.sequence 
          next_staple.linear_points = front_lin_positions.concat(next_staple.linear_points)
          next_staple.interpolated_points = front_int_positions.concat(next_staple.interpolated_points)
          # need to update positions as well
          prev_staple.next = next_staple.object_id
          next_staple.prev = prev_staple.object_id

          staples.delete(staple)
        end
      end
    end
    staples
  end

  def generate_shape_edges(vertices)
    sequence = IO.read('./app/assets/scaffolds/7249.txt')
    edges = []
    ### add extra checks for moving directions
    seq_count = 0
    vertices.each_with_index do |v, i|
      this_edge = Edge.new(v, vertices[(i + 1) % vertices.size])
      this_step = moving_step(this_edge)
      seq = if i == vertices.size - 1
              sequence[seq_count...sequence.size]
            else
              sequence[seq_count...(seq_count + this_step)]
            end
      seq_count += this_step
      this_edge.sequence = seq
      edges << this_edge
    end

    edges.each_with_index do |edge, idx|
      edge.prev = edges[(idx - 1) % edges.size].object_id
      edge.next = edges[(idx + 1) % edges.size].object_id
    end
    update_adjacent_edges(edges)
  end

  def update_adjacent_edges(edges)
    edges.each do |e1|
      edges.each do |e2|
        next unless e1 != e2
        next unless e1.directional_change != e2.directional_change
        next unless e1.next != e2.object_id && e1.prev != e2.object_id
        next if on_boundary?(e1.v2)
        next unless e1.has_shared_vertex?(e2)

        e1.adjacent_edges << e2.object_id
      end
    end
    edges
  end

  def moving_step(edge)
    w_step = (@width / (@segments * SSDNA_NT_DIST)).floor
    h_step = (@height / (@segments * SSDNA_NT_DIST)).floor
    d_step = (@depth / (@segments * SSDNA_NT_DIST)).floor

    case edge.directional_change
    when :x
      w_step
    when :y
      h_step
    when :z
      d_step
    end
  end

  def on_boundary?(v)
    # TODO: fix for plane roatation
    (approx(v.x, @width) && approx(v.y, @height)) ||
      (approx(v.x, @width) && approx(v.z, @depth)) ||
      (approx(v.y, @height) && approx(v.z, @depth))
  end

  def approx(val, divisor)
    (val.ceil % divisor).zero? || (val.floor % divisor).zero?
  end
end
