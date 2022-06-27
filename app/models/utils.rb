# frozen_string_literal: true

module Utils
  def self.deep_copy(obj)
    Marshal.load(Marshal.dump(obj))
  end
end
