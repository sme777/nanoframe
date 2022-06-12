# frozen_string_literal: true

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

  def self.normalize(vectors, wsl, hsl, dsl, corners=true)
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
      if dpe < 0 && dne < 0
        dpe_shift = -shift_val
        dne_shift = shift_val
      elsif dpe > 0 && dne > 0
        dpe_shift = shift_val
        dne_shift = -shift_val
      elsif dpe < 0 && dne > 0
        dpe_shift = -shift_val
        dne_shift = -shift_val
      elsif dpe > 0 && dne < 0
        dpe_shift = shift_val
        dne_shift = shift_val
      end
    elsif dne > 0 && dpe > 0
      dpe_shift = shift_val
      dne_shift = -shift_val
    elsif dne < 0 && dpe < 0
      dpe_shift = -shift_val
      dne_shift = shift_val
    elsif dne > 0 && dpe < 0
      dpe_shift = -shift_val
      dne_shift = -shift_val
    elsif dne < 0 && dpe > 0
      dpe_shift = shift_val
      dne_shift = shift_val
    end
    [dpe_shift, dne_shift]
  end

  def self.outgoer?(v, width, height, depth)
    if v.x % width == 0 && (v.y % height == 0 || v.z % depth == 0)
      true
    elsif v.y % width == 0 && (v.x % height == 0 || v.z % depth == 0)
      true
    elsif v.z % width == 0 && (v.x % height == 0 || v.y % depth == 0)
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
        if !!vertex && !on_boundary?(vertex, 200, 200, 200)          
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
    elsif v1.y == dims[1] && v2.y == dims[1]
      :S3
    elsif v1.y.zero? && v2.y.zero?
      :S4
    elsif v1.x.zero? && v2.x.zero?
      :S5
    else
      :S6
    end
  end
end
