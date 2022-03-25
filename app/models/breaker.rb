# frozen_string_literal: true

class Breaker
  SSDNA_NT_DIST = 0.332

  def initialize(id, dimensions, shape, segments, scaff_length)
    @shape = shape
    @generator_id = id
    @segments = segments
    @scaff_length = scaff_length
    setup_dimensions(dimensions, shape)
  end

  def setup_dimensions(dimensions, shape)
    case @shape
    when :cube
      @width = dimensions[0]
      @height = dimensions[1]
      @depth = dimensions[2]
    when :tetrahedron
      @radius = dimensions[0]
    end
  end

  def staples_preprocess
    contraints = {}
    case @shape
    when :cube
      h_constraint = ((@width / @segments) / SSDNA_NT_DIST).floor >= 50
      v_constraint = ((@height / @segments) / SSDNA_NT_DIST).floor >= 50
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
    model.enforce(0.5 * x + 0.5 * y + z1 >= @width)
    model.enforce(0.5 * x + 0.5 * y + z2 >= @height)
    model.enforce(0.5 * x + 0.5 * y + z1 <= @width)
    model.enforce(0.5 * x + 0.5 * y + z2 <= @height)
    model.enforce(x + z3 >= @width)
    model.enforce(y + z4 >= @height)
    model.enforce(x + z3 <= @width)
    model.enforce(y + z4 <= @height)
    model.enforce(2 * s2 * x + 4 * s * y + 2 * s * z1 + 2 * s * z2 + (s2 - s) * z3 + (s2 - s) * z4 <= @scaff_length)
    # z1, z2, z3, z4 filtered restraints
    model.enforce(z1 >= 0)
    if constraints[:z1]
    else
      model.enforce(z1 <= 0)
    end

    model.enforce(z2 >= 0)
    if constraints[:z2]
    else
      model.enforce(z2 <= 0)
    end

    model.enforce(z3 >= 0)
    if constraints[:z3]
    else
      model.enforce(z3 <= 0)
    end

    model.enforce(z4 >= 0)
    if constraints[:z4]
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
    refl, refr = refl.first, refr.first
    edges = generate_shape_edges(vertices, @width / (@segments * SSDNA_NT_DIST))
    staples = []
    # ext_b_hor, ext_b_vert, ext_hor, ext_vert = exts
    edges.each do |edge|
      if on_boundary?(edge.v2)
        adjacent = ObjectSpace._id2ref(edge.next)
        if ext_b_hor == [0] && ext_b_vert == [0]
          staples << Staple.new(edge, adjacent, refr / 2, refr / 2, :refraction, 2)
        elsif (edge.directional_change == :x && ext_b_hor != [0]) ||
              (edge.directional_change == :y && ext_b_vert != [0])
          start = refl / 2
          extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
          extensions.each do |ext|
            staples << Staple.new(edge, edge, start, start + ext, :extension)
            start += ext
          end
          staples << Staple.new(edge, adjacent, start, refr / 2, :refraction, 2)

        elsif (edge.directional_change == :x && ext_b_hor == [0]) ||
              (edge.directional_change == :y && ext_b_vert == [0])
          staples << Staple.new(edge, adjacent, refr / 2, refr / 2, :refraction, 2)
        end
      else
        adjacent = ObjectSpace._id2ref(edge.adjacent_edges.first)
        if ext_hor == [0] && ext_vert == [0]
          staples << Staple.new(edge, adjacent, refl / 2, refl / 2, :reflection, 1)
        elsif (edge.directional_change == :x && ext_hor != [0]) ||
              (edge.directional_change == :y && ext_vert != [0])
          start = refl / 2
          extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
          extensions.each do |ext|
            staples << Staple.new(edge, edge, start, start + ext, :extension)
            start += ext
          end
          staples << Staple.new(edge, adjacent, start, refl / 2, :reflection, 1)

        elsif (edge.directional_change == :x && ext_hor == [0]) ||
              (edge.directional_change == :y && ext_vert == [0])
          staples << Staple.new(edge, adjacent, refl / 2, refl / 2, :reflection, 1)
        end
      end
    end
    staples
  end

  def generate_shape_edges(vertices, w_step)
    sequence = IO.read('./app/assets/scaffolds/7249.txt')
    edges = []
    ### add extra checks for moving directions
    vertices.each_with_index do |v, i|
      new_edge = Edge.new(v, vertices[(i + 1) % vertices.size])
      seq = if i == vertices.size - 1
              sequence.slice(i * w_step, sequence.size)
            else
              sequence.slice(i * w_step, w_step)
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

  def on_boundary?(v)
    # TODO: fix for plane roatation
    (v.x % @width).zero? || (v.y % @height).zero? || (v.z % @depth).zero?
  end
end
