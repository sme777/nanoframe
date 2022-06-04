# frozen_string_literal: true

require 'json'

class Graph
  include ActiveModel::Serialization

  attr_accessor :vertices, :edges, :sets, :route, :planes, :vertices, :edges, :vertex_cuts, :staples, :staple_colors, :boundary_edges

  # dimension[0] -> width
  # dimension[1] -> height
  # dimension[2] -> depth
  def initialize(id, dimensions, shape, segments, scaff_length)
    setup_dimensions(dimensions, shape)
    @generator_id = id
    @segments = segments.to_i
    @scaff_length = scaff_length
    @staple_breaker = Breaker.new(id, dimensions, shape, segments, scaff_length)
    v_and_e = create_vertices_and_edges(shape)
    @vertices = v_and_e[0]
    @edges = v_and_e[1]
    @template_planes = find_four_planes
    @planes, @raw_planes = find_plane_combination(@template_planes)
    @sorted_vertices, @normalized_vertices, @linear_points, @sampling_frequency = generate_spline_points
    @colors = generate_colors   
    @sorted_edges, @staples = generate_staples
    @start_idx, @group1, @group2, @boundary_edges = open_structure
    # byebug
    @vertex_cuts = []
    @boundary_edges.each do |e| 
      @vertex_cuts << e.v1 if !@vertex_cuts.include?(e.v1)
      @vertex_cuts << e.v2 if !@vertex_cuts.include?(e.v2)
    end
    @staples = @staple_breaker.update_boundary_strands(@boundary_edges, @staples, 3)
    @staple_colors = generate_staple_colors
    # write_staples(@staples, @staple_colors)
    # write_nfr
  end


  # def self.update_bridge_length(generator)
  #   staples = nil
  #   boundary_edges = nil
  #   staple_breaker = Breaker.new(id, dimensions, shape, segments, scaff_length)
  #   staples = staple_breaker.update_boundary_strands(boundary_edges, staples)
  #   staples
  # end

  def write_nfr
    # byebug
    hash = {}
    hash[:name] = "M13mp18"
    hash[:sequence] = Generator.m13_scaffold
    hash[:vertex_cuts] = @vertex_cuts.size
    hash[:dimension] = [@width, @height, @depth]
    hash[:points] = {linear: @linear_points, interpolated: @interpolated_points}
    hash[:colors] = {linear: @colors, interpolated: @colors}
    
    staple_arr = []
    @staples.each_with_index do |st, idx|
      st_hash = {}
      st_hash[:name] = st.name
      st_hash[:sequence] = st.sequence
      st_hash[:points] = {linear: Vertex.flatten(st.linear_points), interpolated: Vertex.flatten(st.interpolated_points)}
      st_hash[:colors] = {linear: @staple_colors[idx], interpolated: @staple_colors[idx]}
      staple_arr << st_hash
    end

    hash[:staples] = staple_arr
    hash[:bridge_length] = 3
    hash[:graph] = to_hash
    
    filename = "test.json"
    file = File.open("app/assets/results/#{filename}", 'w')
    file.write(JSON.generate(hash))
    file.close

  end

  def write_staples(staples, colors)
    filename = "#{@width}x#{@height}x#{@depth}-#{@segments - 1}-#{Time.now}"
    file = File.open("app/assets/results/#{filename}.csv", 'w')
    file.write("name,color,sequence,length")
    file.write("\n")
    staples.each_with_index do |staple, idx|
      staple_color = colors[idx]
      file.write("#{staple.name},#{rgb_to_hex(staple_color)},#{staple.sequence},#{staple.sequence.size}")
      file.write("\n")
    end
    file.close
    filename
  end

  def self.rgb_to_hex(rgb_color)
    red = (rgb_color[0] * 255).to_i.to_s(16)
    green = (rgb_color[1] * 255).to_i.to_s(16)
    blue = (rgb_color[2] * 255).to_i.to_s(16)
    hex = sprintf("#%02s%02s%02s", red, green, blue)
    hex
  end

  def setup_dimensions(dimensions, shape)
    case shape
    when :cube
      @width = dimensions[0]
      @height = dimensions[1]
      @depth = dimensions[2]
    when :tetrahedron
      @radius = dimensions[0]
    end
  end

  def create_vertices_and_edges(shape)
    v = []
    e = []
    x = 0
    y = 0

    case shape
    when :cube
      while x <= @segments && y <= @segments

        unless (x % @segments).zero? && (y % @segments).zero?
          v.push(Vertex.new(x, y))
          if x.zero?
            e << Edge.new(Vertex.new(x, y), Vertex.new(x + 1, y))
          elsif y.zero?
            e << Edge.new(Vertex.new(x, y), Vertex.new(x, y + 1))
          elsif x != @segments && y != @segments
            e << Edge.new(Vertex.new(x, y), Vertex.new(x + 1, y))
            e << Edge.new(Vertex.new(x, y), Vertex.new(x, y + 1))
          end
        end
        y += 1

        if y > @segments
          y = 0
          x += 1
        end

      end
    when :tetrahedron
      v = get_vertices(:triangle)
      stripes = connect_vertices(v)
      e = get_edges(stripes)
    end
    [v, e]
  end

  def get_vertices(shape)
    vertices = []
    case shape
    when :triangle
      @segments.times do |i|
        vertices << Vertex.new((i.to_f + 1) / 2, (Math.sqrt(3) / 2 * (i.to_f + 1)).round(3), 0)
        vertices << Vertex.new(i.to_f + 1, 0, 0)
        vertices << Vertex.new((@segments + 1.to_f) / 2 + (i.to_f + 1) / 2,
                               (Math.sqrt(3) / 2 * (@segments + 1) - Math.sqrt(3) / 2 * (i + 1).to_f).round(3), 0)
      end
    end
    vertices
  end

  def modifications_objects
    {staples: Marshal.dump(@staples), boundary_edges: Marshal.dump(@boundary_edges),}
  end


  def staples_json
    staple_lin_points = []
    staple_int_points = []
    staple_names = []
    staple_sequences = []
    scaffold_idxs = []
    @staples.each do |staple|
      staple_lin_points << Vertex.flatten(staple.linear_points)
      staple_names << staple.name
      staple_sequences << staple.sequence
      scaffold_idxs << staple.scaffold_idxs
    end
    JSON.generate({linear: staple_lin_points, colors: @staple_colors.flatten,
                    names: staple_names, sequences: staple_sequences, scaffold_idxs: scaffold_idxs })
  end

  def connect_vertices(vs)
    disp_v = vs.clone
    e = []
    until disp_v.empty?
      v1 = disp_v[rand(0..(disp_v.length - 1))]
      disp_v.delete(v1)
      v2 = disp_v[rand(0..(disp_v.length - 1))]
      if !same_side?(v1, v2)
        e << Edge.new(v1, v2)
        disp_v.delete(v2)
      else
        disp_v << v1
      end
    end
    e
  end

  def get_edges(stripes)
    undisected_edges = stripes.clone
    (0..undisected_edges.length).each do |i|
      (0..undisected_edges.length).each do |j|
        if i == j
          next
        elsif intersect(undisected_edges[i], undisected_edges[j])
          intersection_point = intersection(undisected_edges[i], undisected_edges[j])
          e1_split = split_edge(undisected_edges[i], intersection_point)
          e2_split = split_edge(undisected_edges[j], intersection_point)
          undisected_edges.delete(undisected_edges[i])
          undisected_edges.delete(undisected_edges[j])
          undisected_edges << e1_split
          undisected_edges << e2_split
          # did_change
        end
      end
    end
    # puts Edge.beautify_edges(stripes)

    undisected_edges
  end

  def ccw(a, b, c)
    (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
  end

  def intersect(e1, e2)
    a = e1.v1
    b = e1.v2
    c = e2.v1
    d = e2.v2
    ccw(a, c, d) != ccw(b, c, d) && ccw(a, b, c) != ccw(a, b, d)
  end

  def intersection(e1, e2)
    xdiff = [e1.v1.x - e1.v2.x, e2.v1.x - e2.v2.x]
    ydiff = [e1.v1.y - e1.v2.y, e2.v1.y - e2.v2.y]

    div = det(xdiff, ydiff)
    d = [det([e1.v1.x, e1.v1.y], [e1.v2.x, e1.v2.y]), det([e2.v1.x, e2.v1.y], [e2.v2.x, e2.v2.y])]
    x = det(d, xdiff) / div
    y = det(d, ydiff) / div
    Vertex.new(x, y, 0)
  end

  def det(a, b)
    a[0] * b[1] - a[1] * b[0]
  end

  def split_edge(edge, point)
    [Edge.new(edge.v1, point), Edge.new(point, edge.v2)]
  end

  def same_side?(v1, v2)
    (v1.y == v2.y && v1.y.zero?) || (v1.y != 0 && v2.y != 0 &&
    (v1.x < (@segments + 1) / 2 && v2.x < (@segments + 1) / 2 ||
    v1.x > (@segments + 1) / 2 && v2.x > (@segments + 1) / 2))
  end

  def find_outgoers
    v_set = []
    @vertices.each do |v|
      v_set.append(v) if (v.x % @segments).zero? || (v.y % @segments).zero?
    end
    v_set
  end

  def is_contained?(o, sets)
    sets.each do |s|
      return true if o == s.v.first || o == s.v.last
    end
    false
  end

  def find_vertex(vs, x, y, z)
    vs.each do |v|
      return v if v.x == x && v.y == y && v.z = z
    end
    nil
  end

  # randomized algorithm that finds general plane routings
  # by selecting random start and end vertices
  def find_general_plane_routing
    outgoers = find_outgoers
    total_outgoers = outgoers.length
    taken_outgoers = []
    taken_edges = []
    sets = []
    while taken_outgoers.length != total_outgoers
      s = outgoers[rand(0..(outgoers.length - 1))]
      outgoers.delete(s)
      t = outgoers[rand(0..(outgoers.length - 1))]
      dfs_edges = dfs(s, t, taken_edges)
      if dfs_edges != []
        outgoers.delete(t)
        taken_outgoers << s
        taken_outgoers << t
        taken_edges.concat(dfs_edges)
        new_set = GraphSet.new(s)
        new_set.add_node(t)
        dfs_edges.each do |e|
          new_set.add_edge(e)
        end
        sets << new_set
      else
        outgoers << s
      end
    end
    if taken_edges.length != @edges.length
      find_general_plane_routing
    else
      sets
    end
  end

  # performs depth first search starting from s and find a
  # path to t if one is available, returns list of edges or []
  def dfs(k, t, taken_edges)
    visited = {}
    edges = deep_copy_edges(taken_edges)
    # 0 denotes horizontal movement and 1 vertical
    prev = (k.x % @segments).zero? ? 0 : 1

    @vertices.each do |v|
      visited[v.hash] = [] # empty array of edges
    end
    visited = explore(k, prev, edges, visited)
    visited[t.hash]
  end

  def explore(k, prev, edges, visited)
    neighbors = find_neighbors(k, prev, edges)
    return [] if neighbors.length.zero?

    neighbors.each do |neighbor|
      new_edge = Edge.new(k, neighbor)
      edges = find_and_remove_edge(edges, new_edge)

      if visited[neighbor.hash] == []
        visited[neighbor.hash] << new_edge
        visited[k.hash].each do |p|
          visited[neighbor.hash] << p
        end
      end
      explore(neighbor, (prev - 1).abs, edges, visited)
    end
    visited
  end

  def deep_copy_edges(taken_edges)
    edges = []
    @edges.each do |e|
      edges << Edge.new(e.v1, e.v2) unless is_taken_edge?(e, taken_edges)
    end
    edges
  end

  def is_taken_edge?(e, taken_edges)
    taken_edges.each do |tk|
      if (tk.v1 == e.v1 && tk.v2 == e.v2) ||
         (tk.v2 == e.v1 && tk.v1 == e.v2)
        return true
      end
    end
    false
  end

  def find_and_remove_edge(edges, e)
    (0...edges.length).each do |i|
      next unless (edges[i].v1 == e.v1 && edges[i].v2 == e.v2) ||
                  (edges[i].v2 == e.v1 && edges[i].v1 == e.v2)

      edges.delete_at(i)
      break
    end
    edges
  end

  def find_neighbors(v, prev, edges)
    n = []
    edges.each do |e|
      neighbor_vertex = nil
      if v == e.v1
        neighbor_vertex = find_neighboring_vertex(v, e.v2, e.v1, prev)
      elsif v == e.v2
        neighbor_vertex = find_neighboring_vertex(v, e.v1, e.v2, prev)
      end
      n << neighbor_vertex unless neighbor_vertex.nil?
    end
    n
  end

  def find_neighboring_vertex(v1, v2, _v3, prev)
    return v2 if (prev == 1 && (v2.y - v1.y).abs == 1) || (prev.zero? && (v2.x - v1.x).abs == 1)
  end

  # Generates plane routings for other faces of the cube
  # back -> 0
  # top -> 1
  # bottom -> 2
  # left -> 3
  # right -> 4
  def transform(plane)
    plane_arr = [plane]
    5.times { |i| plane_arr.append(deep_clone_and_transform_plane(plane, i)) }
    plane_arr
  end

  def transform_array(arr, rev = '')
    new_arr = rev == '' ? arr[1..arr.length - 1] : [arr[0]]
    i = 1
    while i < arr.length
      new_arr[i] = send("#{rev}deep_clone_and_transform_plane", arr[i], i - 1)
      i += 1
    end
    new_arr
  end

  def transform_vertex(v, straight, to_add, num)
    vertex = nil
    case num
    when 0
      Vertex.new(v.x, v.y, v.z + straight * @segments)
    when 1
      Vertex.new(v.x, -straight * v.z + to_add, straight * v.y - (@segments - to_add))
    when 2
      Vertex.new(v.x, -straight * v.z, straight * v.y)
    when 3
      Vertex.new(-straight * v.z + to_add, v.y, straight * v.x - (@segments - to_add))
    else
      Vertex.new(-straight * v.z, v.y, straight * v.x)
    end
  end

  def self.define_deep_clone(dir)
    define_method("#{dir}deep_clone") do |set, num|
      v_arr = []
      straight = dir == :"" ? -1 : 1
      to_add = dir == :"" ? @segments : 0
      set.v.each do |v|
        v_arr.append(transform_vertex(v, straight, to_add, num))
      end
      new_set = GraphSet.new(v_arr.first)
      new_set.add_node(v_arr.last)
      new_set
    end
  end

  define_deep_clone :""
  define_deep_clone :reverse_

  def self.define_transform_edge(dir)
    define_method("#{dir}transform_edge") do |e, num|
      straight = dir == :"" ? -1 : 1
      to_add = dir == :"" ? @segments : 0
      v1 = transform_vertex(e.v1, straight, to_add, num)
      v2 = transform_vertex(e.v2, straight, to_add, num)
      new_edge = Edge.new(v1, v2)
      new_edge
    end
  end

  define_transform_edge :""
  define_transform_edge :reverse_

  def self.define_clone_and_transform(dir)
    define_method("#{dir}deep_clone_and_transform_plane") do |obj, num|
      res = []
      edges_covered = []
      obj.each do |set|
        new_set = send("#{dir}deep_clone", set, num)
        set.e.each do |e|
          new_edge = send("#{dir}transform_edge", e, num)
          new_set.add_edge(new_edge)
        end
        res.append(new_set)
      end
      res
    end
  end

  define_clone_and_transform :""
  define_clone_and_transform :reverse_

  # find 4 unique plane routings
  def find_four_planes
    planes = []
    while planes.length != 4
      new_plane = find_general_plane_routing
      planes << new_plane unless includes_plane?(new_plane, planes)
    end
    planes
  end

  def includes_plane?(_new_plane, _plane)
    false
  end

  def find_plane_combination(planes)
    i = 0
    found = false
    combinations = planes.product(planes, planes, planes, planes, planes)
    combinations.each do |c|
      arr = transform_array(c)

      if has_one_loop(arr)
        found = true
        reverse_arr = transform_array(arr, 'reverse_')
        return [arr, reverse_arr]
      end
      i += 1
    end

    return find_plane_combination(find_four_planes) unless found
  end

  def has_one_loop(g)
    all_sets = []
    g.each do |plane|
      plane.each do |set|
        all_sets.append(set)
      end
    end
    next_set = all_sets.first
    starting_vertex = next_set.v.first
    end_vertex = next_set.v.last
    all_sets.delete(next_set)
    until starting_vertex == end_vertex
      # do stuff

      res = find_next_set(all_sets, end_vertex)
      next_set = res[0]
      end_vertex = res[1]
      all_sets.delete(next_set)
    end

    return false unless all_sets.empty?

    true
  end

  # bug here
  def find_next_set(sets, end_vertex)
    sets.each do |s|
      start_v = s.v.first
      end_v = s.v.last

      return [s, end_v] if start_v == end_vertex

      return [s, start_v] if end_v == end_vertex
    end
  end

  def generate_spline_points

    plane_copy = Marshal.load(Marshal.dump(@planes))
    sorted_vertices = Routing.sort_sets(plane_copy)
    normalized_vertices = Marshal.load(Marshal.dump(sorted_vertices))
    sorted_vertices = Routing.normalize(sorted_vertices, @width / @segments.to_f, @height / @segments.to_f,
                                            @depth / @segments.to_f, false)
    normalized_vertices = Routing.normalize(normalized_vertices, @width / @segments.to_f, @height / @segments.to_f,
                                            @depth / @segments.to_f)

    sampled_points = []
    last_corners = nil
    # byebug
    normalized_vertices.each_with_index do |vertex, i|
      next_vert = normalized_vertices[(i + 1) % normalized_vertices.size]
      next_next_vert = normalized_vertices[(i + 2) % normalized_vertices.size]
      dr_ch = Edge.new(vertex, next_vert).directional_change
      edge_sampled_points = Vertex.linspace(dr_ch, 30, vertex, next_vert)
      
      edge_corners = rounded_corner_points([vertex, next_vert, next_next_vert])[-6...]
      edge_sampled_points[...3] = last_corners unless last_corners.nil?
      edge_sampled_points[-3...] = edge_corners[...3]
      last_corners = edge_corners[3...]
      sampled_points.concat(edge_sampled_points) # TODO change 30 to edge length
    end

    sampled_points = Vertex.flatten(sampled_points)
    freq = 30 #(@scaff_length / sampled_points.size).floor.zero? ? 2 : (@scaff_length / sampled_points.size).floor
    [sorted_vertices, normalized_vertices, sampled_points, freq]
  end


  def rounded_corner_points(vertices, radius=1, smoothness=6, closed=true)
    min_vector = (vertices[0] - vertices[1])
    min_length = min_vector.distance
    vertices.each_with_index do |v, idx|
      next unless idx > 1 && idx != vertices.size - 1
      min_length = [min_length, (vertices[i] - vertices[i+1]).distance].min
    end

    if closed
      min_length = [min_length, (vertices[vertices.size - 1] - vertices[0]).distance].min
    end

    radius = radius > min_length * 0.5 ? min_length * 0.5 : radius


    start_idx = 1
    end_idx = vertices.size - 2
    positions = []
    if closed
      start_idx = 0
      end_idx = vertices.size - 1
    end

    i = start_idx
    while i < end_idx
      i_start = i - 1 < 0 ? vertices.size - 1 : i - 1
      i_mid = i
      i_end = i + 1 > vertices.size - 1 ? 0 : i + 1
      p_start = vertices[i_start]
      p_mid = vertices[i_mid]
      p_end = vertices[i_end]

      v_start_mid = (p_start - p_mid).normalize
      v_end_mid = (p_end - p_mid).normalize
      v_center = (((v_end_mid - v_start_mid) / 2) + v_start_mid).normalize
      angle = v_start_mid.angleTo(v_end_mid)
      half_angle = angle * 0.5

      side_length = radius / Math.tan(half_angle)
      center_length = Math.sqrt(side_length ** 2 + radius ** 2)

      start_key_point = v_start_mid * side_length
      center_key_point = v_center * center_length
      end_key_point = v_end_mid * side_length

      cb = center_key_point - end_key_point
      ab = start_key_point - end_key_point
      cb.cross_vectors(ab)
      normal = Vertex.new(cb.x, cb.y, cb.z).normalize

      rotating_point_start = start_key_point - center_key_point
      rotating_point_end = end_key_point - center_key_point
      rotating_angle = rotating_point_start.angleTo(rotating_point_end)
      angle_delta = rotating_angle / smoothness

      a = 0
      while a < smoothness
        temp_point = Vertex.new(rotating_point_start.x, rotating_point_start.y, rotating_point_start.z)
        temp_point.apply_axis_angle(normal, angle_delta * a)
        positions << temp_point + p_mid + center_key_point
        a += 1
      end
      i += 1
    end

    positions

  end



  def generate_colors
    colors = []
    (0...@scaff_length).each do |i|
      t = i.to_f / @scaff_length
      # colors.concat([t / 4, t / 1.5 + 0.15, t + 0.2])
      colors.concat([t + 0.2, t + 0.2, t / 8]) #yellow
    end
    colors
  end

  def generate_staples
    staple_len_map = {}
    [:S1, :S2, :S3, :S4, :S5, :S6].each do |side|
      constraints = @staple_breaker.staples_preprocess(side)
      staple_len_arr = @staple_breaker.ilp(constraints, side)
      staple_adj_len_arr = @staple_breaker.staples_postprocess(staple_len_arr)
      staple_len_map[side] = staple_adj_len_arr
    end
    # byebug
    edges, staples = @staple_breaker.generate_staple_strands(@sorted_vertices, staple_len_map)
  end

  def generate_staple_colors
    staple_colors = []

    @staples.each do |staple|
      staple_color_r = rand
      staple_color_g = rand
      staple_color_b = rand
      staple_color = []
      staple.linear_points.size.times do |i|
        staple_color.concat([staple_color_r, staple_color_g, staple_color_b])
      end
      staple_colors << staple_color
    end

    # (0...@scaff_length * 1.2).each do |i|
    #   t = i.to_f / @scaff_length
    #   staple_colors.concat([t, 0.5, t])
    # end
    staple_colors
  end


  def open_structure(ratio = 1 / 3.to_f)
    start_idx, first_parititon, second_partition, boundary_edges = Routing.find_strongest_connected_components(@sorted_edges,
                                                                                                    ratio, [@width, @height, @depth])
  end


  def to_hash
    return nil if @planes.nil?

    # plane_arr = []
    graph_hash = {}
    graph_hash[:boundary_edges] = boundary_edges.each {|edge| edge.to_hash}
    @planes.each do |plane|
      p = Plane.new(plane, plane.object_id)
      graph_hash[p.name] = p.to_hash
      # plane_arr.append(p.to_hash)
    end

    graph_hash

  end

  # Generates JSON file of the graph
  def to_json(*_args)
    return nil if @planes.nil?
    
    JSON.generate({ "scaffold_length": @scaff_length, "linear_points": @linear_points, 
                    "vertices": @sorted_vertices, "colors": @colors,
                    "staple_colors": @staple_colors.flatten, "start": @start_idx * @sampling_frequency, 
                    "end": (@start_idx + @group1.size) * @sampling_frequency})
  end

end
