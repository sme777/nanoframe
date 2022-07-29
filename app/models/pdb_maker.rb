# frozen_string_literal: true

class PDBMaker
  def setup(top_file, dat_file)
  
  end

  class Atom
    def initialize()

    end

    def hydrogen?

    end

    def to_pdb

    end
  end

  class Nucleotide
    BASE_SHIFT = 1.13
    COMP_SHIFT = 0.5
    OXDNA_TO_ANGSTROM = 8.518
    ANGSTROM_TO_OXDNA = 1.0 / OXDNA_TO_ANGSTROM
    BASES = ["A", "T", "G", "C"]

    def initialize()

    end

    def rotate(R)

    end

    def to_pdb

    end

  end
end
