# frozen_string_literal: true
# require 'm'

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

  def self.connect_vertices(vs)
    disp_v = Utils.deep_copy(vs)
    edges = []
    until disp_v.empty?
      v1 = disp_v[rand(0..(disp_v.length - 1))]
      v2 = disp_v[rand(0..(disp_v.length - 1))]
      if v1.side != v2.side || v1 == v2
        edges << Edge.new(v1, v2)
        disp_v.delete(v1)
        disp_v.delete(v2)
      end
    end
    edges
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

  def self.get_edges(stripes)
    undisected_edges = Utils.deep_copy(stripes)
    for i in (0...undisected_edges.size) do
      for j in (0...undisected_edges.size) do
        if i == j
          next
        else
          edge1 = undisected_edges[i]
          edge2 = undisected_edges[j]
          does_intersect, points = intersects(
            edge1.v1, edge1.v2, 
            edge2.v1, edge2.v2)
          if does_intersect
            e1_split = Routing.split_edge(edge1, points[0])
            e2_split = Routing.split_edge(edge2, points[0])
            undisected_edges.delete(edge1)
            undisected_edges.delete(edge2)
            undisected_edges.concat(e1_split)
            undisected_edges.concat(e2_split)
          end
        end
      end
    end
    undisected_edges.filter {|elem| elem.v1 != elem.v2 }
  end

  def self.split_edge(edge, point)
    [Edge.new(edge.v1, point), Edge.new(point, edge.v2)]
  end

  def self.intersects(p1, p2, p3, p4)
    eps = 10e-8
    p13 = Vertex.new(p1.x - p3.x, p1.y - p3.y, p1.z - p3.z)
    p43 = Vertex.new(p4.x - p3.x, p4.y - p3.y, p4.z - p3.z)
    if (p43.x.abs < eps && p43.y.abs < eps && p43.z.abs < eps)
      return [false, nil]
    end

    p21 = Vertex.new(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
    if (p21.x.abs < eps && p21.y.abs < eps && p21.z.abs < eps)
      return [false, nil]
    end

    d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z
    d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z
    d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z
    d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z
    d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z

    denom = d2121 * d4343 - d4321 * d4321

    if denom < eps
      return [false, nil]
    end

    numer = d1343 * d4321 - d1321 * d4343
    mua = numer / denom
    mub = (d1343 + d4321 * mua) / d4343
    if mua < 0 || mua > 1
      return [false, nil]
    end

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
