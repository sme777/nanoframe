class Nucleotide
  attr_accessor :atoms

  def initialize(base)
    # @atom_number = 0
    if base == "A"
      @atoms = generate_adenine
    elsif base == "G"
      @atoms = generate_guanine
    elsif base == "T"
      @atoms = generate_thymine
    elsif base == "C"
      @atoms = generate_cytosine
    else
      @atoms = nil
    end
  end

  def generate_adenine
    arr = []
    adenine_atoms.each do |a|
      atom = Atom.new('DA', a)
      arr.push(atom)
    end
    arr
  end

  def generate_guanine
    arr = []
    adenine_atoms.each do |a|
      atom = Atom.new('DG', a)
      arr.push(atom)
    end
    arr
  end

  def generate_thymine
    arr = []
    adenine_atoms.each do |a|
      atom = Atom.new('DT', a)
      arr.push(atom)
    end
    arr
  end

  def generate_cytosine
    arr = []
    adenine_atoms.each do |a|
      atom = Atom.new('DC', a)
      arr.push(atom)
    end
    arr
  end

  # PDB atoms sequence for adenine base nucleotide 32
  def adenine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 H5' H5'' H4' H3' H2' H2'' H1' H8 H61 H62 H2]
  end

  # PDB atoms sequence for guanine base nucleotide 33
  def guanine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 H5' H5'' H4' H3' H2' H2'' H1' H8 H1 H21 H22]
  end

  # PDB atoms sequence for thymine base nucleotide 32
  def thymine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 H5' H5'' H4' H3' H2' H2'' H1' H3 H71 H72 H73 H6]
  end

  # PDB atoms sequence for cytosine base nucleotide 30
  def cytosine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 H5' H5'' H4' H3' H2' H2'' H1' H41 H42 H5 H6]
  end
end