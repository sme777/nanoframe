# frozen_string_literal: true

require 'ruby-cbc'

class Breaker
  SSDNA_NT_DIST = 0.332

  def initialize(graph)
    # @shape = shape
    # @generator_id = id
    # @segments = segments
    # @scaff_length = scaff_length
    @graph = graph
    setup_step_sizes
    # setup_dimensions(dimensions, shape)
  end

  def setup_step_sizes
    @w_step = ((@graph.width / SSDNA_NT_DIST) / @graph.segments).floor
    @h_step = ((@graph.height / SSDNA_NT_DIST) / @graph.segments).floor
    @d_step = ((@graph.depth / SSDNA_NT_DIST) / @graph.segments).floor
  end

  # S1 = front; S2 = back; S3 = top; S4 = bottom; S5 = left; S6 = right
  def staples_preprocess(side)
    contraints = {}
    case @graph.shape.name
    when :cube

      w_constraint = ((@graph.width / @graph.segments) / SSDNA_NT_DIST).floor >= 60
      h_constraint = ((@graph.height / @graph.segments) / SSDNA_NT_DIST).floor >= 60
      d_constraint = ((@graph.depth / @graph.segments) / SSDNA_NT_DIST).floor >= 60
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
    case @graph.shape.name
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
    return [(length / 2).floor, (length / 2).ceil] if length / 2 >= 20 && length / 2 <= 60

    break_long_extension(length / 2) * 2
  end

  def ilp(constraints, side)
    model = Cbc::Model.new
    s = @graph.segments
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

    model.enforce(2 * s2 * x + 4 * s * y + 2 * s * z1 + 2 * s * z2 + (s2 - s) * z3 + (s2 - s) * z4 <= @graph.scaff_length)
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

  def generate_staple_strands(vertices, staple_len_map, scaffold_rotation_labels)
    edges = generate_shape_edges(vertices, scaffold_rotation_labels)
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
        _, _, _, refr2, = staple_len_map[next_side]
        refr2 = refr2.first

        if ext_b_hor == [0] && ext_b_vert == [0]
          staple = Staple.new({
                                front: edge, back: adjacent, start_pos: refr / 2, end_pos: refr2 / 2,
                                type: :refraction, buffer: 0, graph: @graph # changed from 2
                              })
          # staple.setup_dimensions([@graph.width, @graph.height, @graph.depth], @segments, @shape)
          edge.assoc_strands << staple.object_id
        else
          dir_ch = edge.directional_change
          if (dir_ch == :x && ext_b_hor != [0]) ||
             (dir_ch == :y && ext_b_vert != [0]) ||
             (dir_ch == :z && ext_b_vert != [0] && %i[S3 S4].include?(curr_side)) ||
             (dir_ch == :z && ext_b_hor != [0] && %i[S5 S6].include?(curr_side))

            start = refl2
            case dir_ch
            when :x
              extensions = ext_b_hor
            when :y
              extensions = ext_b_vert
            when :z
              extensions = %i[S3 S4].include?(curr_side) ? ext_b_vert : ext_b_hor
            end
            extension_staples = []
            extensions.each do |ext|
              staple = Staple.new({
                                    front: edge,
                                    back: edge,
                                    start_pos: start,
                                    end_pos: start + ext,
                                    type: :extension, graph: @graph
                                  })
              # staple.setup_dimensions([@width, @height, @depth], @segments, @shape)
              edge.assoc_strands << staple.object_id
              extension_staples << staple
              start += ext
            end

            extension_staples.each_with_index do |stp, idx|
              stp.next = extension_staples[idx + 1].object_id if stp != extension_staples.last
              stp.prev = extension_staples[idx - 1].object_id if stp != extension_staples.first
            end
            staples.concat(extension_staples)
            staple = Staple.new({
                                  front: edge, back: adjacent, start_pos: start, end_pos: refr2 / 2,
                                  type: :refraction, buffer: 0, graph: @graph # changed from 2
                                })
            # staple.setup_dimensions([@width, @height, @depth], @segments, @shape)
          else
            staple = Staple.new({
                                  front: edge, back: adjacent, start_pos: refr / 2, end_pos: refr2 / 2,
                                  type: :reflection, buffer: 0, graph: @graph
                                })

            # staple.setup_dimensions([@width, @height, @depth], @segments, @shape)
            edge.assoc_strands << staple.object_id
          end
        end
      else
        adjacent = ObjectSpace._id2ref(edge.adjacent_edges.first)
        if ext_hor == [0] && ext_vert == [0]
          staple = Staple.new({
                                front: edge, back: adjacent, start_pos: refl2, end_pos: refl2,
                                type: :reflection, buffer: 0, graph: @graph
                              })
        else
          dir_ch = edge.directional_change
          if (dir_ch == :x && ext_hor != [0]) ||
             (dir_ch == :y && ext_vert != [0]) ||
             (dir_ch == :z && ext_vert != [0] && %i[S3 S4].include?(curr_side)) ||
             (dir_ch == :z && ext_hor != [0] && %i[S5 S6].include?(curr_side))
            start = refl2

            case dir_ch
            when :x
              extensions = ext_hor
            when :y
              extensions = ext_vert
            when :z
              extensions = %i[S3 S4].include?(curr_side) ? ext_vert : ext_hor
            end

            # extensions = ext_b_hor != [0] ? ext_b_hor : ext_b_vert
            extension_staples = []
            extensions.each do |ext|
              staple = Staple.new({
                                    front: edge, back: edge, start_pos: start, end_pos: start + ext,
                                    type: :extension, graph: @graph
                                  })
              # staple.setup_dimensions([@width, @height, @depth], @segments, @shape)
              edge.assoc_strands << staple.object_id
              extension_staples << staple
              start += ext
            end

            extension_staples.each_with_index do |stp, idx|
              stp.next = extension_staples[idx + 1].object_id if stp != extension_staples.last
              stp.prev = extension_staples[idx - 1].object_id if stp != extension_staples.first
            end

            staples.concat(extension_staples)
            staple = Staple.new({
                                  front: edge, back: adjacent, start_pos: start, end_pos: refl2,
                                  type: :reflection, buffer: 0, graph: @graph
                                })

          else
            # cut_size = refl2 >
            min_size = [refl1, refl2].min
            max_size = [refl1, refl2].max
            size1 = edge.sequence.size > max_size ? max_size : min_size
            size2 = edge.sequence.size <= max_size ? max_size : min_size
            staple = Staple.new({
                                  front: edge, back: adjacent, start_pos: size1, end_pos: size2,
                                  type: :reflection, buffer: 0, graph: @graph
                                })
          end
        end
        # staple.setup_dimensions([@width, @height, @depth], @segments, @shape)
        edge.assoc_strands << staple.object_id
      end
      staples << staple
    end
    set_staple_neighbors(staples)
    [edges, staples]
  end

  def edge_side(edge)
    Routing.find_plane_number(edge.v1, edge.v2, [@graph.width, @graph.height, @graph.depth])
  end

  def step_size(side)
    case @graph.shape.name
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

        case staple1.type
        when :extension

          if staple2.type == :reflection || staple2.type == :refraction
            if staple1.front == staple2.back
              staple1.next = staple2.object_id
            elsif staple1.back == staple2.front
              staple1.prev = staple2.object_id
            end
          end
        # works for only relfection-refraction pairs
        when :refraction, :reflection
          if staple1.front == staple2.back
            staple1.prev = staple2.object_id
          elsif staple1.back == staple2.front
            staple1.next = staple2.object_id
          end
        end
      end
    end
  end

  def update_boundary_strands(edges, staples, bridge_len)
    residual_staples = []
    edges.each do |edge|
      edge.assoc_strands.each do |staple_id|
        staple = ObjectSpace._id2ref(staple_id)
        next unless staple.type == :reflection && staples.include?(staple)

        cutoff = (staple.sequence.size / 2 - bridge_len)
        back_sequence = staple.sequence[...cutoff]
        back_idxs = staple.scaffold_idxs[...cutoff]
        back_rotation_labels = staple.complementary_rotation_labels[...cutoff]
        front_sequence = staple.sequence[cutoff...]
        front_idxs = staple.scaffold_idxs[cutoff...]
        front_rotation_labels = staple.complementary_rotation_labels[cutoff...]

        back_lin_positions = staple.points[...cutoff]
        back_lin_original_positions = staple.original_points[...cutoff]
        front_lin_positions = staple.points[cutoff...]
        front_lin_original_positions = staple.original_points[cutoff...]

        prev_staple = ObjectSpace._id2ref(staple.prev)
        next_staple = ObjectSpace._id2ref(staple.next)

        # Create two staples from the broken one
        cutoff2 = prev_staple.type == :reflection ? (prev_staple.points.size / 2 + bridge_len) : ((prev_staple.sequence.size + back_sequence.size) / 2)
        staple_type = nil
        # Toggle parameters cutoff2 and prev staple length
        if cutoff2 < 20 || prev_staple.sequence.size < 25
          back_staple_labels = prev_staple.complementary_rotation_labels + back_rotation_labels
          back_staple_seq = prev_staple.sequence + back_sequence
          back_staple_pos = prev_staple.points + back_lin_positions
          back_staple_original_pos = prev_staple.original_points + back_lin_original_positions
          back_staple_idx = prev_staple.scaffold_idxs + back_idxs
          staple_type = prev_staple.type == :refraction ? :mod_refraction : :mod_reflection # prev_staple.type
          staples.delete(prev_staple)
        else
          adjusted_shift = prev_staple.sequence.size - (cutoff2 - back_sequence.size).abs
          back_staple_labels = prev_staple.complementary_rotation_labels[adjusted_shift...] + back_rotation_labels
          back_staple_seq = prev_staple.sequence[adjusted_shift...] + back_sequence
          back_staple_pos = prev_staple.points[adjusted_shift...] + back_lin_positions
          back_staple_original_pos = prev_staple.original_points[adjusted_shift...] + back_lin_original_positions
          back_staple_idx = prev_staple.scaffold_idxs[adjusted_shift...] + back_idxs
          staple_type = :mod_reflection

          prev_staple.complementary_rotation_labels = prev_staple.complementary_rotation_labels[...adjusted_shift]
          prev_staple.sequence = prev_staple.sequence[...adjusted_shift]
          prev_staple.scaffold_idxs = prev_staple.scaffold_idxs[...adjusted_shift]
          prev_staple.points = prev_staple.points[...adjusted_shift]
          prev_staple.original_points = prev_staple.original_points[...adjusted_shift]
          prev_staple.type = prev_staple.type
        end

        back_staple = Staple.new({ sequence: back_staple_seq,
                                   points: back_staple_pos,
                                   original_points: back_staple_original_pos,
                                   scaffold_idxs: back_staple_idx,
                                   complementary_rotation_labels: back_staple_labels,
                                   front: staple.front,
                                   back: staple.back,
                                   buffer: prev_staple.buffer,
                                   clone: true,
                                   type: staple_type,
                                   graph: @graph })

        residual_staples << back_staple
        if staples.include?(prev_staple)
          prev_staple.next = back_staple.object_id
          back_staple.prev = prev_staple.object_id
        else
          back_staple.prev = prev_staple.prev
          ObjectSpace._id2ref(prev_staple.prev).next = back_staple.object_id
        end
        # Toggle parameters cutoff2 and prev staple length
        cutoff2 = next_staple.type == :reflection ? (next_staple.points.size / 2 + next_staple.buffer + bridge_len) : ((front_sequence.size + next_staple.sequence.size) / 2)
        staple_type = nil
        if cutoff2 < 20 || next_staple.sequence.size < 25
          front_staple_labels = front_rotation_labels + next_staple.complementary_rotation_labels
          front_staple_seq = front_sequence + next_staple.sequence
          front_staple_pos = front_lin_positions + next_staple.points
          front_staple_original_pos = front_lin_original_positions + next_staple.original_points
          front_staple_idx = front_idxs + next_staple.scaffold_idxs
          staple_type = next_staple.type == :refraction ? :mod_refraction : :mod_reflection # :mod_reflection
          staples.delete(next_staple)

        else
          adjusted_shift = (cutoff2 - front_sequence.size).abs
          front_staple_labels = front_rotation_labels + next_staple.complementary_rotation_labels[...adjusted_shift]
          front_staple_seq = front_sequence + next_staple.sequence[...adjusted_shift]
          front_staple_pos = front_lin_positions + next_staple.points[...adjusted_shift]
          front_staple_original_pos = front_lin_original_positions + next_staple.original_points[...adjusted_shift]
          front_staple_idx = front_idxs + next_staple.scaffold_idxs[...adjusted_shift]
          staple_type = :mod_reflection

          next_staple.complementary_rotation_labels = next_staple.complementary_rotation_labels[adjusted_shift...]
          next_staple.sequence = next_staple.sequence[adjusted_shift...]
          next_staple.scaffold_idxs = next_staple.scaffold_idxs[adjusted_shift...]
          next_staple.points = next_staple.points[adjusted_shift...]
          next_staple.original_points = next_staple.original_points[adjusted_shift...]
          next_staple.type = next_staple.type
        end
        front_staple = Staple.new({ sequence: front_staple_seq,
                                    points: front_staple_pos,
                                    original_points: front_staple_original_pos,
                                    scaffold_idxs: front_staple_idx,
                                    complementary_rotation_labels: front_staple_labels,
                                    front: staple.front,
                                    back: staple.back,
                                    buffer: next_staple.buffer,
                                    clone: true,
                                    type: staple_type, graph: @graph })
        residual_staples << front_staple
        if staples.include?(next_staple)
          next_staple.prev = front_staple.object_id
          front_staple.next = next_staple.object_id
        else
          front_staple.next = next_staple.next
          ObjectSpace._id2ref(next_staple.next).prev = front_staple.object_id
        end

        back_staple.next = front_staple.object_id # !front_staple.nil? ? front_staple.object_id : next_staple.object_id
        front_staple.prev = back_staple.object_id # !back_staple.nil? ? back_staple.object_id : prev_staple.object_id

        staples.delete(staple)
      end
    end
    staples.concat(residual_staples)
  end

  def break_refraction_staples(staples, ext_sequences, ext_length)
    new_staples = []
    temp_staples = []
    removed_staples = []
    staples.each do |staple|
      corner_vertex, corner_idx = staple.find_corner_vertex
      if corner_idx.nil?
        # staple.type = :mod_reflection #if staple.type == :temp
        new_staples << staple unless removed_staples.include?(staple)
        next
      end
      front_staple = Staple.new({
                                  sequence: staple.sequence[...corner_idx + 1],
                                  points: staple.points[...corner_idx + 1],
                                  original_points: staple.original_points[...corner_idx + 1],
                                  scaffold_idxs: staple.scaffold_idxs[...corner_idx + 1],
                                  complementary_rotation_labels: staple.complementary_rotation_labels[...corner_idx + 1],
                                  front: staple.front,
                                  back: staple.back,
                                  buffer: staple.buffer,
                                  clone: true,
                                  type: :exterior_end_refraction,
                                  graph: @graph
                                })
      back_staple = Staple.new({
                                 sequence: staple.sequence[corner_idx + 1...],
                                 points: staple.points[corner_idx + 1...],
                                 original_points: staple.original_points[corner_idx + 1...],
                                 scaffold_idxs: staple.scaffold_idxs[corner_idx + 1...],
                                 complementary_rotation_labels: staple.complementary_rotation_labels[corner_idx + 1...],
                                 front: staple.front,
                                 back: staple.back,
                                 buffer: staple.buffer,
                                 clone: true,
                                 type: :exterior_start_refraction,
                                 graph: @graph
                               })

      front_staple.prev = staple.prev
      front_staple.next = back_staple.object_id
      prev_staple = ObjectSpace._id2ref(staple.prev)
      prev_staple.next = front_staple.object_id

      back_staple.prev = front_staple.object_id
      back_staple.next = staple.next
      next_staple = ObjectSpace._id2ref(staple.next)
      next_staple.prev = back_staple.object_id

      if ext_length.positive?
        front_staple.update_exterior_extension(:end, ext_sequences[0], ext_length)
        back_staple.update_exterior_extension(:start, ext_sequences[0], ext_length)
        ext_sequences.rotate
      end

      if front_staple.sequence.size < 30
        front_prev_staple = ObjectSpace._id2ref(front_staple.prev)
        merged_front_staple = merge_staples(front_prev_staple, front_staple, :exterior_end_refraction)
        new_staples << merged_front_staple
        removed_staples << front_prev_staple
      else
        new_staples << front_staple
      end

      if back_staple.sequence.size < 30
        back_next_staple = ObjectSpace._id2ref(back_staple.next)
        merged_back_staple = merge_staples(back_staple, back_next_staple, :exterior_start_refraction)
        new_staples << merged_back_staple
        removed_staples << back_next_staple
      else
        new_staples << back_staple
      end
    end

    new_staples.filter { |stp| !removed_staples.include?(stp) }
  end

  def extend_interior_staples(staples, interior_extensions, interior_extension_length)
    staples.each_with_index do |staple, _idx|
      staple.update_interior_extension(interior_extensions[0], interior_extension_length)
      interior_extensions.rotate
    end
    staples
  end

  def merge_staples(st1, st2, type)
    staple = Staple.new({
                          sequence: st1.sequence + st2.sequence,
                          points: st1.points + st2.points,
                          original_points: st1.original_points + st2.original_points,
                          scaffold_idxs: st1.scaffold_idxs + st2.scaffold_idxs,
                          complementary_rotation_labels: st1.complementary_rotation_labels + st2.complementary_rotation_labels,
                          front: st1.front,
                          back: st2.back,
                          buffer: st1.buffer + st2.buffer,
                          clone: true,
                          type: type,
                          graph: @graph
                        })

    staple.prev = st1.prev
    staple.next = st2.next

    prev_staple = ObjectSpace._id2ref(st1.prev)
    next_staple = ObjectSpace._id2ref(st2.next)

    prev_staple.next = staple.object_id
    next_staple.prev = staple.object_id
    staple
  end

  def generate_shape_edges(vertices, scaffold_rotation_labels)
    sequence = IO.read('./app/assets/scaffolds/7249.txt')
    edges = []
    scaffold_idxs = []
    sequence.size.times { |k| scaffold_idxs << k }
    ### add extra checks for moving directions
    seq_count = 0
    # position_idx = 0
    vertices.each_with_index do |v, i|
      this_edge = Edge.new(v, vertices[(i + 1) % vertices.size])
      this_step = moving_step(this_edge)
      if i == vertices.size - 1
        seq = sequence[seq_count...sequence.size]
        edge_rotation_labels = scaffold_rotation_labels[seq_count...sequence.size]
        edge_scaffold_idxs = scaffold_idxs[seq_count...sequence.size]
      else
        seq = sequence[seq_count...(seq_count + this_step)]
        edge_rotation_labels = scaffold_rotation_labels[seq_count...(seq_count + this_step)]
        edge_scaffold_idxs = scaffold_idxs[seq_count...(seq_count + this_step)]
      end

      corner_seq = on_boundary?(this_edge.v2) ? 1 : 0
      seq_count += (this_step + corner_seq)
      this_edge.sequence = seq
      this_edge.scaffold_idxs = edge_scaffold_idxs
      this_edge.complementary_rotation_labels = edge_rotation_labels.map { |e| 9 - e }
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
    w_step = (@graph.width / (@graph.segments * SSDNA_NT_DIST)).floor
    h_step = (@graph.height / (@graph.segments * SSDNA_NT_DIST)).floor
    d_step = (@graph.depth / (@graph.segments * SSDNA_NT_DIST)).floor

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
    (approx(v.x, @graph.width) && approx(v.y, @graph.height)) ||
      (approx(v.x, @graph.width) && approx(v.z, @graph.depth)) ||
      (approx(v.y, @graph.height) && approx(v.z, @graph.depth))
  end

  def approx(val, divisor)
    (val.ceil % divisor).zero? || (val.floor % divisor).zero?
  end
end
