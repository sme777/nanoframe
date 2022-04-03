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

    # vectors.each_with_index do |vector, i|
    #     prev_edge = Edge.new(vectors[(i - 1) % vectors.size], vector)
    #     next_edge = Edge.new(vector, vectors[(i + 1) % vectors.size])
    #     pe_dc, pe_vec = prev_edge.directional_change_vec
    #     ne_dc, ne_vec = next_edge.directional_change_vec
    #     cdr, cpe, cne = change_dir(pe_dc, ne_dc)
    #     next unless !cdr.nil?
    #     dpe_dc, dne_dc = corner_change(cdr, cpe, cne, pe_vec, ne_vec)
    #     cpe_dc = vector.instance_variable_get("@#{cpe}")
    #     cne_dc = vector.instance_variable_get("@#{cne}")
    #     vector.instance_variable_set("@#{cpe}", cpe_dc + dpe_dc)
    #     vector.instance_variable_set("@#{cne}", cne_dc + dne_dc)

    # end

    vectors
  end

  def self.change_dir(prev_dr, next_dr)
    if (prev_dr == :x && next_dr == :z) 
      [:hor, :x, :z]
    elsif (prev_dr == :x && next_dr == :y) 
      [:hor, :x, :y]
    elsif(prev_dr == :z && next_dr == :y)
      [:hor, :z, :y]
    elsif (prev_dr == :z && next_dr == :x)
      [:vert, :z, :x]
    elsif (prev_dr == :y && next_dr == :x)
      [:vert, :y, :x]
    elsif (prev_dr == :y && next_dr == :z)
      [:vert, :y, :z]
    end
  end

  def self.corner_change(cdr, cpe, cne, dpe, dne)
    if cdr == :hor
      if dpe < 0 && dne < 0
        dpe_shift = -0.5
        dne_shift = 0.5
      elsif dpe > 0 && dne > 0
        dpe_shift = 0.5
        dne_shift = -0.5
      elsif dpe < 0 && dne > 0
        dpe_shift = -0.5
        dne_shift = -0.5
      elsif dpe > 0 && dne < 0
        dpe_shift = 0.5
        dne_shift = 0.5
      end
    else
      if dne > 0 && dpe > 0
        dpe_shift = -0.5
        dne_shift = 0.5
      elsif dne < 0 && dpe < 0
        dpe_shift = +0.5
        dne_shift = 0.5
      elsif dne > 0 && dpe < 0
        dpe_shift = 0.5
        dne_shift = 0.5
      elsif dne < 0 && dpe > 0
        dpe_shift = -0.5
        dne_shift = -0.5
      end
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
    edge_size = edges.size
    max_strength = -Float::INFINITY
    edge_start = -1
    final_ratio = -1
    final_array = []
    ratio = (edge_size * ratio).floor

    (ratio...edge_size).each do |j|
      (0...edge_size).each do |i|
        subarray = find_subarray(edges, i, j)
        subarray_strength = find_subarray_strength(subarray, dims)
        next unless subarray_strength > max_strength

        max_strength = subarray_strength
        edge_start = i
        final_ratio = j
        final_array = subarray
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

    (0...(arr.size - 1)).each do |i|
      plane = find_plane_number(arr[i], arr[i + 1], dims)
      if planes.key?(plane)
        planes[plane] += 1
      else
        planes[plane] = 1
      end
    end
    plane_vals = planes.values.sort_by(&:-@)
    plane_vals[...3].sum / arr.size.to_f
  end

  def self.find_plane_number(v1, v2, dims)
    if v1.z.zero? && v2.z.zero?
      0
    elsif v1.z == -dims[2] && v2.z == -dims[2]
      1
    elsif v1.y == dims[1] && v2.y == dims[1]
      2
    elsif v1.y.zero? && v2.y.zero?
      3
    elsif v1.x.zero? && v2.x.zero?
      4
    else
      5
    end
  end

end
