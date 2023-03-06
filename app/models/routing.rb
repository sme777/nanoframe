# frozen_string_literal: true

# require 'm'
require 'matrix'

module Routing
  @@prev_vertex = nil

  def self.find_next_set(sets, last_vertex, taken_sets)
    sets.each do |set|
      set.e.each do |edge|
        return set if equals(last_vertex, [edge.v1, edge.v2]) && !taken_sets.include?(set)
      end
    end
    nil
  end

  def self.merge_sets(planes_routing)
    sets = []
    planes_routing.each do |plane_route|
      plane_route.each do |set|
        sets << set
      end
    end
    sets
  end

  def self.sort_sets(planes_routing)
    sets = merge_sets(planes_routing)
    taken_sets = []
    edge_arr = []
    next_set = sets.first
    edges_and_last_vertex = get_edge_from_set(next_set)
    edge_arr += edges_and_last_vertex[0]
    last_vertex = edges_and_last_vertex[1]
    counter = 0
    taken_sets << sets[0]

    while sets.length - 1 != counter
      next_set = find_next_set(sets, last_vertex, taken_sets)
      taken_sets << next_set
      edges_and_last_vertex = get_edge_from_set(next_set)
      edge_arr += edges_and_last_vertex[0]
      last_vertex = edges_and_last_vertex[1]
      counter += 1
    end
    edge_arr
  end

  def self.get_edge_from_set(set)
    vectors = []
    set.e.reverse_each do |edge|
      vectors << edge.v1 unless equals(edge.v1, vectors)

      vectors << edge.v2 unless equals(edge.v2, vectors)
    end
    last_vertex = set.e.first.v2

    if equals(last_vertex, [@@prev_vertex])
      last_vertex = set.e.last.v1
      vectors = vectors.reverse
    end
    @@prev_vertex = last_vertex
    [vectors[...-1], last_vertex]
  end

  def self.normalize(vectors, wsl, hsl, dsl, corners = true)
    vectors.each do |vector|
      vector.x *= wsl
      vector.y *= hsl
      vector.z *= dsl
    end

    return vectors unless corners

    vectors
  end

  def self.change_dir(prev_dr, next_dr)
    if prev_dr == :x && next_dr == :z
      %i[hor x z]
    elsif prev_dr == :x && next_dr == :y
      %i[hor x y]
    elsif prev_dr == :z && next_dr == :y
      %i[hor z y]
    elsif prev_dr == :z && next_dr == :x
      %i[vert z x]
    elsif prev_dr == :y && next_dr == :x
      %i[vert y x]
    elsif prev_dr == :y && next_dr == :z
      %i[vert y z]
    end
  end

  def self.corner_change(cdr, _cpe, _cne, dpe, dne)
    shift_val = 0.5
    if cdr == :hor
      if dpe.negative? && dne.negative?
        dpe_shift = -shift_val
        dne_shift = shift_val
      elsif dpe.positive? && dne.positive?
        dpe_shift = shift_val
        dne_shift = -shift_val
      elsif dpe.negative? && dne.positive?
        dpe_shift = -shift_val
        dne_shift = -shift_val
      elsif dpe.positive? && dne.negative?
        dpe_shift = shift_val
        dne_shift = shift_val
      end
    elsif dne.positive? && dpe.positive?
      dpe_shift = shift_val
      dne_shift = -shift_val
    elsif dne.negative? && dpe.negative?
      dpe_shift = -shift_val
      dne_shift = shift_val
    elsif dne.positive? && dpe.negative?
      dpe_shift = -shift_val
      dne_shift = -shift_val
    elsif dne.negative? && dpe.positive?
      dpe_shift = shift_val
      dne_shift = shift_val
    end
    [dpe_shift, dne_shift]
  end

  def self.outgoer?(v, width, height, depth)
    if (v.x % width).zero? && ((v.y % height).zero? || (v.z % depth).zero?)
      true
    elsif (v.y % width).zero? && ((v.x % height).zero? || (v.z % depth).zero?)
      true
    elsif (v.z % width).zero? && ((v.x % height).zero? || (v.y % depth).zero?)
      true
    else
      false
    end
  end

  def self.equals(vertex, vals)
    return unless !vertex.nil? && vals.any? { |v| !v.nil? }

    vals.each do |val|
      return true if vertex == val
    end
    false
  end

  def self.find_strongest_connected_components(edges, ratio, dims)
    max_strength = -Float::INFINITY
    # edge_start = -1
    first_partition = []
    second_partition = []
    start_idx = 0
    min_edges = (edges.size * ratio).floor
    double_edges = edges * 2
    (min_edges...edges.size).each do |j|
      (0...edges.size).each do |i|
        subarray = double_edges[i...(i + j)]
        subarray_strength = find_subarray_strength(subarray, dims)
        next unless subarray_strength > max_strength

        start_idx = i
        max_strength = subarray_strength
        first_partition = subarray
        second_partition = double_edges[(i + j)...((i + j) + (edges.size - first_partition.size))]
        # edge_start = i
        # final_array = subarray
      end
    end

    boundary_edges = []
    first_partition.each do |p1_edge|
      second_partition.each do |p2_edge|
        vertex = p1_edge.shared_vertex?(p2_edge)
        if !vertex.nil? && !on_boundary?(vertex, 200, 200, 200)
          boundary_edges << p1_edge unless boundary_edges.include?(p1_edge)
          boundary_edges << p2_edge unless boundary_edges.include?(p2_edge)
        end
      end
    end

    [start_idx, first_partition, second_partition, boundary_edges]
  end

  def self.on_boundary?(v, width, height, depth)
    # TODO: fix for plane roatation
    (approx(v.x, width) && approx(v.y, height)) ||
      (approx(v.x, width) && approx(v.z, depth)) ||
      (approx(v.y, depth) && approx(v.z, depth))
  end

  def self.approx(val, divisor)
    (val.ceil % divisor).zero? || (val.floor % divisor).zero?
  end

  def self.find_subarray_strength(edges, dims)
    planes = {}

    edges.each do |edge|
      plane = find_plane_number(edge.v1, edge.v2, dims)
      if planes.key?(plane)
        planes[plane] += 1
      else
        planes[plane] = 1
      end
    end
    plane_vals = planes.values.sort_by(&:-@)
    plane_vals[...3].sum / edges.size.to_f
  end

  def self.find_plane_number(v1, v2, dims)
    if v1.z.zero? && v2.z.zero?
      :S1
    elsif v1.z == -dims[2] && v2.z == -dims[2]
      :S2
    elsif v1.y.zero? && v2.y.zero?
      :S3
    elsif v1.y == dims[1] && v2.y == dims[1]
      :S4
    elsif v1.x.zero? && v2.x.zero?
      :S5
    elsif v1.x == dims[0] && v2.x == dims[0]
      :S6
    elsif v1.z.zero?
      :S1
    elsif v1.z == -dims[2]
      :S2
    elsif v1.y.zero?
      :S3
    elsif v1.y == dims[1]
      :S4
    elsif v1.x.zero?
      :S5
    elsif v1.x == dims[0]
      :S6
    end
  end


  def self.connect_all_vertices(vs)
    edges = []
    vs.each do |vertex1|
      vs.each do |vertex2|
        next unless (vertex1 != vertex2) && vertex1.side != vertex2.side
        
        new_edge = Edge.new(vertex1, vertex2)
        already_exisst = false
        edges.each do |edge|
          if (new_edge.v1 == edge.v1 && new_edge.v2 == edge.v2) || (new_edge.v1 == edge.v2 && new_edge.v2 == edge.v1)
            already_exisst = true
            break
          end
        end
        edges << new_edge unless already_exisst
      end
    end
    edges
  end

  def self.connect_vertices(vs, corners)
    disp_v = Utils.deep_copy(vs)
    disp_c = Utils.deep_copy(corners) + Utils.deep_copy(vs)
    disp2_c = Utils.deep_copy(disp_c)
    edges = []
    until disp_v.empty?
      v1 = disp_v.sample
      v2 = disp_v.sample
      if v1.side == v2.side && disp_v.size == 2
        disp_v = Utils.deep_copy(vs)
        edges = []
      end

      next unless v1.side != v2.side && v1 != v2

      edges << Edge.new(v1, v2)
      disp_v.delete(v1)
      disp_v.delete(v2)
    end
    # boundary_edges = []
    # disp_c.each do |vertex|
    #   vertex1 = Routing.find_closest_vertex(vertex, disp2_c)
    #   edge1 = Edge.new(vertex, vertex1)
    #   boundary_edges << edge1 if (boundary_edges.filter {|e| (e.v1 == edge1.v1 && e.v2 == edge1.v2) || (e.v1 == edge1.v2 && e.v2 == edge1.v1)}).empty?
    #   disp2_c.delete(vertex1)
    #   vertex2 = Routing.find_closest_vertex(vertex, disp2_c)
    #   edge2 = Edge.new(vertex, vertex2)
    #   boundary_edges << edge2 if (boundary_edges.filter {|e| (e.v1 == edge2.v1 && e.v2 == edge2.v2) || (e.v1 == edge2.v2 && e.v2 == edge2.v1)}).empty?
    #   disp2_c << vertex1
    # end
    # byebug
    edges # boundary_edges]
  end

  def self.find_closest_vertex(corner, vertices)
    closest_so_far = Float::INFINITY
    closest_vertex = nil
    vertices.each do |vertex|
      distance = corner.distance_to_squared(vertex)
      if distance < closest_so_far && distance != 0
        closest_so_far = distance
        closest_vertex = vertex
      end
    end
    closest_vertex
  end

  def self.get_vertices(edges)
    vertices = []
    edges.each do |edge|
      includes_v1 = false
      includes_v2 = false
      vertices.each do |vertex|
        includes_v1 = true if vertex == edge.v1
        includes_v2 = true if vertex == edge.v2
      end
      vertices << edge.v1.copy unless includes_v1
      vertices << edge.v2.copy unless includes_v2
    end
    vertices
  end

  def self.find_optimal_edges(outgoer_vertices, corners)
    total_area = Float::INFINITY
    running_streak = 0
    edges = []
    running_triangles = []
    failures = 0
    while running_streak < 2

      connected_edges = Routing.connect_vertices(outgoer_vertices, corners)
      new_vertices, new_edges = Routing.get_edges(connected_edges)
      # all_edges =
      # byebug

      a1, b1, c1, d1 = Routing.get_plane_equation(new_vertices[0], new_vertices[1], new_vertices[2])
      translated_vertices = new_vertices.map { |vertex| Vertex.new(vertex.x, vertex.y, vertex.z - d1 / c1) }
      # a2,b2,c2,d2 = Routing.get_plane_equation(translated_vertices[0], translated_vertices[1], translated_vertices[2])
      rotation_matrix = Routing.xy_rotation_matrix(a1, b1, c1, d1)
      # translated_points = new_vertices.map {|vertex| a * vertex.x + b * vertex.y + c * vertex.z}
      rotated_points = new_vertices.map { |vertex| rotation_matrix * Vector[vertex.x, vertex.y, vertex.z] }
      # translated_points = new_vertices.map {|vertex| rotation_matrix*Vector[vertex.x, vertex.y, vertex.z - d/c]}
      transformed_vertices = rotated_points.map { |point| Vertex.new(point[0], point[1], point[2] + d1 / c1) }
      # transformed_vertices = transformed_vertices.map {|vertex| }
      # projected_points =
      # byebug
      begin
        triangles = Delaunator.triangulate(transformed_vertices.map { |vertex| [vertex.x, vertex.y] })
        # byebug if new_edges.size == 12
      rescue StandardError => e
        failures += 1
        next
      end
      # byebug if triangles.size == 18
      current_area = Routing.compute_surface_area(transformed_vertices, triangles)
      # byebug
      if current_area < total_area
        total_area = current_area
        running_streak = 0
        edges = new_edges
        running_triangles = triangles
      else
        running_streak += 1
      end
    end
    # byebug
    edges

    # edge_visit_map = {}
    # edges.each do |edge|
    #   edge_visit_map[edge.hash] = 0
    # end

    # edges.each do |edge|

    #   edges.each do |next_edge|
    #     next unless edge.v2 == next_edge.v1 || edge.v2 == next_edge.v2
    #     if edge.v2 == next_edge.v1

    #     else

    #     end
    #   end
    # end
  end

  def self.compute_surface_area(vertices, triangles)
    total_area = 0
    (0..triangles.size - 1).step(3) do |i|
      triangle_area = Routing.compute_polygon_area([
                                                     vertices[triangles[i]],
                                                     vertices[triangles[i + 1]],
                                                     vertices[triangles[i + 2]]
                                                   ])
      total_area += Math.exp(triangle_area)
    end
    total_area
    # edge_visit_map = {}
    # cut_edges.each do |cut_edge|
    #   # set hash -> [type, current, limit]
    #   edge_visit_map[cut_edge.object_id] = [:cut, 0, 2]
    # end

    # boundary_edges.each do |boundary_edge|
    #   edge_visit_map[boundary_edge.object_id] = [:boundary, 0, 1]
    # end

    # total_edges = cut_edges + boundary_edges
    # # new_edges = Utils.deep_copy(total_edges)
    # surface_area = 0
    # total_edges.each do |edge|
    #   satisfied = false
    #   polyon_edges = [edge]
    #   next_edge = edge
    #   while !satisfied
    #     next_edge, edge_visit_map = Routing.find_closest_edge(edge.v1, next_edge, total_edges, edge_visit_map)
    #     if next_edge.nil?
    #       polyon_edges = []
    #       break
    #     end
    #     polyon_edges << next_edge
    #     if next_edge.v2 == edge.v1
    #       # byebug
    #       satisfied = true
    #     end
    #   end
    #   # byebug if Routing.compute_polygon_area(polyon_edges) > 0
    #   surface_area += Routing.compute_polygon_area(polyon_edges)
    # end
    # surface_area
  end

  def self.find_closest_edge(origin, target, edges, visit_map)
    min_distance = Float::INFINITY
    next_edge = nil
    # byebug
    edges.each do |edge|
      next if target == edge || (target.v2 != edge.v1 && target.v2 != edge.v2)

      edge_data = visit_map[edge.object_id]
      other = target.v2 == edge.v1 ? edge.v2 : edge.v1

      distance = origin.distance_to_squared(other)
      if distance < min_distance && edge_data[1] < edge_data[2]
        min_distance = distance
        next_edge = edge
      end
    end

    unless next_edge.nil?
      next_edge_data = visit_map[next_edge.object_id]
      next_edge_data[1] += 1
      visit_map[next_edge.object_id] = next_edge_data
      next_edge = target.v2 == next_edge.v1 ? next_edge : next_edge.reverse unless next_edge.nil?
    end
    [next_edge, visit_map]
  end

  def self.xy_rotation_matrix(a, b, c, _d)
    # byebug
    cos_theta = c / Math.sqrt(a**2 + b**2 + c**2)
    sin_theta = Math.sqrt((a**2 + b**2) / (a**2 + b**2 + c**2))
    u1 = b / Math.sqrt((a**2 + b**2 + c**2))
    u2 = - a / Math.sqrt((a**2 + b**2 + c**2))
    normal_norm = Math.sqrt(u1**2 + u2**2)
    u1 /= normal_norm
    u2 /= normal_norm

    Matrix[[cos_theta + (u1**2) * (1 - cos_theta), u1 * u2 * (1 - cos_theta), u2 * sin_theta],
           [u1 * u2 * (1 - cos_theta), cos_theta + (u2**2) * (1 - cos_theta), -u1 * sin_theta],
           [-u2 * sin_theta, u1 * sin_theta, cos_theta]]
  end

  # follows Ex + Fy + Hz + K = 0
  def self.get_plane_equation(a, b, c)
    ab = b - a
    ac = c - a
    e, f, h = ab.cross(ac)
    # gcd = h.gcd(e.gcd(f))
    # e /= gcd
    # f /= gcd
    # g /= gcd
    k = -(e * a.x + f * a.y + h * a.z)
    [e, f, h, k]
  end

  def self.compute_polygon_area(vertices)
    ab = vertices[1] - vertices[0]
    ac = vertices[2] - vertices[0]
    u = ab.cross(ac)
    Math.sqrt(u[0]**2 + u[1]**2 + u[2]**2).abs / 2

    # byebug if result.nil?
    # return 0 if edges.size < 3
    # byebug
    # # vertices = edges.map {|edge| edge.v2}
    # total = Vertex.new(0, 0, 0)
    # vertices.each_with_index do |_, idx|
    #   vi1 = vertices[idx]
    #   vi2 = vertices[(idx+1)%vertices.size]
    #   prod = vi1.cross(vi2)
    #   total.x += prod[0]
    #   total.y += prod[1]
    #   # total.z += prod[2]
    # end

    # result = total.dot(Vertex.unit_normal(
    #   Vertex.new(vertices[0].x, vertices[0].y, 0),
    #   Vertex.new(vertices[1].x, vertices[1].y, 0),
    #   Vertex.new(vertices[2].x, vertices[2].y, 0)))
    # Math.exp((result/2).abs)
  end

  def divide_intersecting_segments(segments)
    non_intersecting_segments = []
    for i in 0...segments.length
      u1, v1 = segments[i].v1, segemnts[i].v2
      for j in i+1...segments.length
        u2, v2 = segments[j].v1, segments[j].v2
        if do_line_segments_intersect(u1, v1, u2, v2)
          intersection_point = compute_intersection_point(u1, v1, u2, v2)
          non_intersecting_segments << Edge.new(u1, intersection_point)
          non_intersecting_segments << Edge.new(intersection_point, v2)
          u1, v1 = intersection_point, v1
          u2, v2 = intersection_point, u2
        end
      end
      non_intersecting_segments << [u1, v1]
    end
    return non_intersecting_segments
  end

  def do_line_segments_intersect(p1, p2, q1, q2)
    """
    Returns true if line segment segment1 intersects line segment segment2.
    """
    # p1, p2 = segment1
    # q1, q2 = segment2
  
    # Compute cross products
    r = p2 - p1
    s = q2 - q1
    rp = (q1 - p1).cross(r)
    sp = (q1 -p1).cross(s)
  
    # Check for collinear segments
    if rp == 0 && sp == 0
      # Segments are collinear
      return is_point_on_segment(q1, p1, p2) || is_point_on_segment(q2, p1, p2) || is_point_on_segment(p1, q1, q2) || is_point_on_segment(p2, q1, q2)
    end
  
    # Check for parallel segments
    if rp == 0 || sp == 0
      # Segments are parallel
      return false
    end
  
    # Compute intersection point
    t = (q1 - p1).cross(s) / sp
    u = rp / sp
    if t >= 0 && t <= 1 && u >= 0 && u <= 1
      # Segments intersect at point p + t*r = q + u*s
      return true
    end
  
    # Segments do not intersect
    return false
  end

  def is_point_on_segment(point, segment_start, segment_end)
    """
    Returns true if point lies on the line segment defined by segment_start and segment_end.
    """
    return point == segment_start || point == segment_end || (point.x >= [segment_start.x, segment_end.x].min && point.x <= [segment_start.x, segment_end.x].max && point.y >= [segment_start.y, segment_end.y].min && point.y <= [segment_start.y, segment_end.y].max && (point.x - segment_start.x) * (segment_end.y - segment_start.y) == (segment_end.x - segment_start.x) * (point.y - segment_start.y))
  end
  
  
  
  def compute_intersection_point(segment1, segment2)
    """
    Returns the intersection point of line segment segment1 and line segment segment2.
    Assumes that the segments intersect at a single point.
    """
    p1, p2 = segment1
    q1, q2 = segment2
  
    # Compute cross products
    r = subtract_points(p2, p1)
    s = subtract_points(q2, q1)
    rp = cross_product(subtract_points(q1, p1), r)
    sp = cross_product(subtract_points(q1, p1), s)
  
    # Compute intersection point
    t = cross_product(subtract_points(q1, p1), s) / sp
    return add_points(p1, multiply_point_by_scalar(r, t))
  end
  
  def self.compute_all_segements(stripes, outgoers)
    prev_iter = 0
    next_iter = -1
    nodes = []
    edges = stripes
    byebug
    while prev_iter != next_iter
      nodes, edges = Routing.get_edges(edges, outgoers)
      prev_iter = next_iter
      next_iter = nodes.size
    end
    [nodes, edges]
  end


  def self.get_edges(stripes, outgoers)
    # undisected_edges = Utils.deep_copy(stripes)
    disected_edges = []
    # intersections = 0
    for i in 0...stripes.size
      for j in i+1...stripes.size

        edge1 = stripes[i]
        edge2 = stripes[j]

        # skip the edge if they only share an end vertex
        # this will prevent perpetual dividing of edges
        next unless !((edge1.v1 == edge2.v1 || edge1.v1 == edge2.v2 || 
                     edge1.v2 == edge2.v1 || edge1.v2 == edge2.v2))
        
        
        does_intersect, points = intersects(
          edge1.v1, edge1.v2,
          edge2.v1, edge2.v2
        )
        if does_intersect
          disected_edges << Edge.new(edge1.v1, points[0])
          disected_edges << Edge.new(points[0], edge1.v2)
          disected_edges << Edge.new(edge2.v1, points[0])
          disected_edges << Edge.new(points[0], edge2.v2)
        end
      end
      
    end

    new_vertices = []
    disected_edges.each do |edge|
      if outgoers.include?(edge.v1) && outgoers.include?(edge.v2)
        # byebug
        disected_edges.delete(edge)
      end
      # edge.v1.round(3)
      # edge.v2.round(3)
      new_vertices << edge.v1 unless new_vertices.include?(edge.v1)
      new_vertices << edge.v2 unless new_vertices.include?(edge.v2)
    end

    [new_vertices, disected_edges]
  end

  def self.includes_outgoer(outgoers, node)
    outgoers.each do |outgoer|
      if outgoer == node
        return true
      end
    end
    return false
  end

  def self.split_edge(edge, point)
    [Edge.new(edge.v1, point), Edge.new(point, edge.v2)]
  end

  def self.intersects(p1, p2, p3, p4)
    eps = 10e-8
    p13 = Vertex.new(p1.x - p3.x, p1.y - p3.y, p1.z - p3.z)
    p43 = Vertex.new(p4.x - p3.x, p4.y - p3.y, p4.z - p3.z)
    return [false, nil] if p43.x.abs < eps && p43.y.abs < eps && p43.z.abs < eps

    p21 = Vertex.new(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
    return [false, nil] if p21.x.abs < eps && p21.y.abs < eps && p21.z.abs < eps

    d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z
    d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z
    d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z
    d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z
    d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z

    denom = d2121 * d4343 - d4321 * d4321

    return [false, nil] if denom < eps

    numer = d1343 * d4321 - d1321 * d4343
    mua = numer / denom
    mub = (d1343 + d4321 * mua) / d4343
    return [false, nil] if mua.negative? || mua > 1

    pa = Routing.crop(p1 + p21 * mua).round(6)
    pb = Routing.crop(p3 + p43 * mub).round(6)
    [true, [pa, pb]]
  end

  def self.crop(point)
    esp = 10e-7
    point.x = 0 if point.x.abs < esp
    point.y = 0 if point.y.abs < esp
    point.z = 0 if point.z.abs < esp
    point
  end
end
