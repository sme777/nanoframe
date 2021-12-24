# frozen_string_literal: true

require 'json'

class Edge
  attr_accessor :v1, :v2

  def initialize(v1, v2)
    @v1 = v1
    @v2 = v2
  end

  def string
    "#{v1.string} -> #{v2.string}"
  end

  def to_hash
    { "v1": @v1.to_hash, "v2": @v2.to_hash }
  end

  def to_json(*_args)
    JSON.generate({ "v1": @v1.to_hash, "v2": @v2.to_hash })
  end

  def self.string_of_edges(_edges)
    ''
  end

  def self.beautify_edges(edges)
    result = ''
    edges.each do |e|
      result += "#{e.string}\n"
    end
    result
  end
end
