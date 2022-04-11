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

      @w_step = (dimensions[0] / SSDNA_NT_DIST) / @segments
      @h_step = (dimensions[1] / SSDNA_NT_DIST) / @segments
      @d_step = (dimensions[2] / SSDNA_NT_DIST) / @segments
    when :tetrahedron
      @radius = dimensions[0]
    end
  end

  def staples_preprocess
    contraints = {}
    case @shape
    when :cube
      h_constraint = ((@width / @segments) / SSDNA_NT_DIST).floor >= 60
      v_constraint = ((@height / @segments) / SSDNA_NT_DIST).floor >= 60
      contraints[:z1] = h_constraint
      contraints[:z3] = h_constraint
      contraints[:z2] = v_constraint
      contraints[:z4] = v_constraint
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

  def ilp(constraints)
    model = Cbc::Model.new
    s = @segments
    s2 = s**2
    x, y, z1, z2, z3, z4 = model.int_var_array(6, 0..Cbc::INF)
    model.maximize(2 * s2 * x + 4 * s * y + 2 * s * z1 + 2 * s * z2 + (s2 - s) * z3 + (s2 - s) * z4)

    # x, y mandatory restraints
    model.enforce(x >= 20)
    model.enforce(y >= 20)
    model.enforce(x <= 60)
    model.enforce(y <= 60)
    model.enforce(0.5 * x + 0.5 * y + z1 >= @w_step)
    model.enforce(0.5 * x + 0.5 * y + z2 >= @h_step)
    model.enforce(0.5 * x + 0.5 * y + z1 <= @w_step)
    model.enforce(0.5 * x + 0.5 * y + z2 <= @h_step)
    model.enforce(x + z3 >= @w_step)
    model.enforce(y + z4 >= @h_step)
    model.enforce(x + z3 <= @w_step)
    model.enforce(y + z4 <= @h_step)
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
    [problem.value_of(x), problem.value_of(y), problem.value_of(z1),
     problem.value_of(z2), problem.value_of(z3), problem.value_of(z4)]
  end

  # (edges, refl, refr, exts)
  def generate_staple_strands(vertices, staple_len_arr)
    refl, refr, ext_b_hor, ext_b_vert, ext_hor, ext_vert = staple_len_arr
    refl = refl.first
    refr = refr.first
    edges = generate_shape_edges(vertices)
    staples = []

    # ext_b_hor, ext_b_vert, ext_hor, ext_vert = exts

    edges.each do |edge|
      if on_boundary?(edge.v2)
        adjacent = ObjectSpace._id2ref(edge.next)
        if ext_b_hor == [0] && ext_b_vert == [0]
          staple = Staple.new(edge, adjacent, refr / 2, refr / 2, :refraction, 2)
          edge.assoc_strands << staple.object_id
          staples << staple
        elsif (edge.directional_change == :x && ext_b_hor != [0]) ||
              (edge.directional_change == :y && ext_b_vert != [0])
          start = refl / 2
          extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
          extensions.each do |ext|
            staple = Staple.new(edge, edge, start, start + ext, :extension)
            edge.assoc_strands << staple.object_id
            staples << staple
            start += ext
          end
          staples << Staple.new(edge, adjacent, start, refr / 2, :refraction, 2)

        elsif (edge.directional_change == :x && ext_b_hor == [0]) ||
              (edge.directional_change == :y && ext_b_vert == [0])
          staple = Staple.new(edge, adjacent, refr / 2, refr / 2, :refraction, 2)
          edge.assoc_strands << staple.object_id
          staples << staple
        end
      else
        # byebug
        adjacent = ObjectSpace._id2ref(edge.adjacent_edges.first)
        if ext_hor == [0] && ext_vert == [0]
          staple = Staple.new(edge, adjacent, refl / 2, refl / 2, :reflection, 1)
          edge.assoc_strands << staple.object_id
          staples << staple
        elsif (edge.directional_change == :x && ext_hor != [0]) ||
              (edge.directional_change == :y && ext_vert != [0])
          start = refl / 2
          extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
          extensions.each do |ext|
            staple = Staple.new(edge, edge, start, start + ext, :extension)
            edge.assoc_strands << staple.object_id
            staples << staple
            start += ext
          end
          staple = Staple.new(edge, adjacent, start, refl / 2, :reflection, 1)
          edge.assoc_strands << staple.object_id
          staples << staple

        elsif (edge.directional_change == :x && ext_hor == [0]) ||
              (edge.directional_change == :y && ext_vert == [0])
          staples = Staple.new(edge, adjacent, refl / 2, refl / 2, :reflection, 1)
          edge.assoc_strands << staple.object_id
          staples << staple
        end
      end
    end
    set_staple_neighbors(staples)
    [edges, staples]
  end

  def set_staple_neighbors(staples)
    staples.each do |staple1|
      staples.each do |staple2|
        next unless staple1 != staple2

        if staple1.type == :extension

          if staple2.type == :reflection || staple2.type == :reflection
            if staple1.front == staple2.back
              staple1.next = staple2.object_id
            elsif staple1.back == staple2.front
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

    vertices.each_with_index do |v, i|
      new_edge = Edge.new(v, vertices[(i + 1) % vertices.size])
      steped = moving_step(new_edge)
      seq = if i == vertices.size - 1
              sequence[i * steped...sequence.size]
            else
              sequence[i * steped...(i + 1) * steped]
            end
      new_edge.sequence = seq
      edges << new_edge
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
    w_step = @width / (@segments * SSDNA_NT_DIST)
    h_step = @height / (@segments * SSDNA_NT_DIST)
    d_step = @depth / (@segments * SSDNA_NT_DIST)

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
      (approx(v.y, @depth) && approx(v.z, @depth))
  end

  def approx(val, divisor)
    (val.ceil % divisor).zero? || (val.floor % divisor).zero?
  end
end
