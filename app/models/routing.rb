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
    edge_arr << Vertex.new(@@prev_vertex.x, @@prev_vertex.y, @@prev_vertex.z)
    edge_arr
  end

  def self.get_edge_from_set(set)
    vectors = []
    # byebug
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

  def self.normalize(vectors, wsl, hsl, _dsl)
    vectors.each do |vector|
      vector.x *= wsl
      vector.y *= hsl
      vector.z *= hsl
    end
    vectors
  end

  def self.equals(vertex, vals)
    return unless !vertex.nil? && vals.any? { |v| !v.nil? }

    vals.each do |val|
      return true if vertex == val
    end
    false
  end

  def self.find_strongest_connected_components(edges, ratio, dims)
    edge_size = edges.size
    max_strength = -Float::INFINITY
    edge_start = -1
    final_ratio = -1
    final_array = []
    ratio = (edge_size * ratio).floor

    for j in ratio...edge_size do
      for i in 0...edge_size do
        subarray = find_subarray(edges, i, j)
        subarray_strength = find_subarray_strength(subarray, dims)
        if subarray_strength > max_strength
          max_strength = subarray_strength
          edge_start = i
          final_ratio = j
          final_array = subarray
        end
      end
    end
    # fedges_size = final_array.size
    # remaining_array = find_subarray(edges, (edge_start + fedges_size - 1) % edge_size, edge_size - fedges_size)
    [edge_start, final_array.size * 3]
  end


  def self.find_subarray(edges, start, length)
    double_egdes = edges + edges
    double_egdes[start...(start + length)]
  end

  def self.find_subarray_strength(arr, dims)
    planes = {}

   for i in 0...(arr.size - 1) do
      plane = find_plane_number(arr[i], arr[i+1], dims)
      if planes.has_key?(plane)
        planes[plane] += 1
      else
        planes[plane] = 1
      end
    end
    plane_vals = planes.values.sort_by { |v| -v }
    (plane_vals[...3].sum) / arr.size.to_f
  end

  def self.find_plane_number(v1, v2, dims)
    if v1.z == 0 && v2.z == 0
      0
    elsif v1.z == -dims[2] && v2.z == -dims[2]
      1
    elsif v1.y == dims[1] && v2.y == dims[1]
      2
    elsif v1.y == 0 && v2.y == 0
      3
    elsif v1.x == 0 && v2.x == 0
      4
    else
      5
    end

  end

  def generate_staple_strands

  end

end
