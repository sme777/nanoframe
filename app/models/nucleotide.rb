class Nucleotide
  attr_accessor :atoms, :base, :x, :y, :z

  def initialize(base, start_pos, chain_num)
    # @atom_number = 0
    @base = base
    @chain_num = chain_num
    @start_pos = start_pos
    @x = start_pos[0]
    @y = start_pos[1]
    @z = start_pos[2]
    @atoms = if base == 'A'
               generate_adenine
             elsif base == 'G'
               generate_guanine
             elsif base == 'T'
               generate_thymine
             elsif base == 'C'
               generate_cytosine
             end
  end

  def generate_adenine
    arr = []
    index = 0
    adenine_atoms.each do |a|
      atom = Atom.new('DA', a)
      atom.x = @start_pos[0] + adenine_delta[index]
      atom.y = @start_pos[1] + adenine_delta[index + 1]
      atom.z = @start_pos[2] + adenine_delta[index + 2]
      index += 3
      arr.push(atom)
    end
    arr
  end

  def generate_guanine
    arr = []
    index = 0
    guanine_atoms.each do |a|
      atom = Atom.new('DG', a)
      atom.x = @start_pos[0] + guanine_delta[index]
      atom.y = @start_pos[1] + guanine_delta[index + 1]
      atom.z = @start_pos[2] + guanine_delta[index + 2]
      index += 3
      arr.push(atom)
    end
    arr
  end

  def generate_thymine
    arr = []
    index = 0
    thymine_atoms.each do |a|
      atom = Atom.new('DT', a)
      atom.x = @start_pos[0] + thymine_delta[index]
      atom.y = @start_pos[1] + thymine_delta[index + 1]
      atom.z = @start_pos[2] + thymine_delta[index + 2]
      index += 3
      arr.push(atom)
    end
    arr
  end

  def generate_cytosine
    arr = []
    index = 0
    cytosine_atoms.each do |a|
      atom = Atom.new('DC', a)
      atom.x = @start_pos[0] + cytosine_delta[index]
      atom.y = @start_pos[1] + cytosine_delta[index + 1]
      atom.z = @start_pos[2] + cytosine_delta[index + 2]
      index += 3
      arr.push(atom)
    end
    arr
  end

  # PDB atoms sequence for adenine base nucleotide 32
  def adenine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 H5' H5'' H4' H3' H2' H2'' H1' H8 H61 H62
       H2]
  end

  # PDB atoms sequence for guanine base nucleotide 33
  def guanine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 H5' H5'' H4' H3' H2' H2'' H1' H8 H1
       H21 H22]
  end

  # PDB atoms sequence for thymine base nucleotide 32
  def thymine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 H5' H5'' H4' H3' H2' H2'' H1' H3 H71 H72
       H73 H6]
  end

  # PDB atoms sequence for cytosine base nucleotide 30
  def cytosine_atoms
    %w[P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 H5' H5'' H4' H3' H2' H2'' H1' H41 H42 H5 H6]
  end

  # Adenine atomic coordinate difference between each atom in the
  # nucleotide compared to the starting one
  def adenine_delta
    [0,	0, 0, 0.265, -0.766, 1.212, -0.162,	1.405, 0.384, 1.148, -0.164, -1.096, 1.689,	-1.45, -1.312, 2.734,	-1.421,	-2.388, 2.158, -1.045, -3.618,
     3.838, -0.386, -2.155, 5.102,	-1.013,	-2.002, 3.803, 0.455,	-3.388, 2.974, -0.237, -4.386, 2.21, 0.631,	-5.304, 1.308, 1.601,	-5.007, 0.712, 2.13, -6.04,
     1.296, 1.438,	-7.103, 1.115, 1.423,	-8.493, 0.269, 2.184,	-9.144, 1.868, 0.663,	-9.273, 2.773, -0.103, -8.699, 3.02, -0.246, -7.412, 2.234,	0.559, -6.659,
     0.906, -2.13,	-1.568, 2.124, -1.797, -0.421, 3.129,	-2.401,	-2.484, 3.636, 0.19, -1.303, 3.387,	1.348, -3.189, 4.732,	0.595, -3.725, 3.588,	-0.851,	-4.93,
     1.102, 1.904,	-4.005, 0.226, 2.119,	-10.132, -0.306, 2.819,	-8.656, 3.366, -0.694, -9.357]
  end

  # Guanine atomic coordinate difference between each atom in the
  # nucleotide compared to the starting one
  def guanine_delta
    [0,	0, 0, 0.774, -0.54,	1.134, -0.301, -1.094, -0.935, -1.349, 0.74, 0.503, -1.255,	1.634, 1.634, -2.596,	2.292, 1.978, -3.143,	2.976, 0.831,
     -3.676,	1.302, 2.416, -4.427,	1.929, 3.482, -4.538,	1.128, 1.169, -4.452,	2.494, 0.482, -4.598,	2.442, -0.992, -4.019, 1.579,	-1.872,
     -4.296,	1.811, -3.126, -5.164, 2.902,	-3.071, -5.89, 3.588,	-4.097, -5.875,	3.41,	-5.296, -6.708,	4.581, -3.62, -6.838,	4.873, -2.312,
     -7.68, 5.806,	-1.998, -6.158,	4.3, -1.324, -5.36,	3.285, -1.767, -0.54,	2.403, 1.411, -0.886,	1.107, 2.489, -2.431,	3.019, 2.759,
     -3.269,	0.357, 2.748, -4.092,	0.353, 0.563, -5.552,	0.834, 1.392, -5.188,	3.148, 0.923, -3.367,	0.79,	-1.559, -7.255,	5.095, -4.283,
     -7.788,	6.021, -1.04, -8.203,	6.273, -2.7]
  end

  # Thymine atomic coordinate difference between each atom in the
  # nucleotide compared to the starting one
  def thymine_delta
    [0,	0, 0, 1.033, -0.765, 0.738, -0.559, -0.983, -0.964, -1.12, 0.639,	0.962, -0.707, 1.341,	2.14, -1.9,	1.867, 2.934, -2.687, 2.773, 2.139,
     -2.857,	0.749, 3.36, -2.815, 0.582,	4.778, -4.217, 1.215,	2.889, -4.066, 2.681,	2.51, -4.969,	3.113, 1.408, -5.921,	4.1, 1.655,
     -6.164,	4.553, 2.753, -6.637,	4.554, 0.588, -6.555,	4.071, -0.684, -7.234, 4.584,	-1.546, -5.632,	2.96,	-0.867, -5.497,	2.31,	-2.223,
     -4.874,	2.528, 0.163, -0.088,	2.162, 1.848, -0.134,	0.689, 2.769, -1.538,	2.394, 3.796, -2.591,	-0.167,	2.884, -4.483, 0.628,	2.042,
     -4.969,	1.091, 3.629, -4.212,	3.265, 3.403, -7.276,	5.3, 0.772, -6.456,	1.887, -2.529, -5.198, 3.055,	-2.964, -4.748,	1.516, -2.189,
     -4.187, 1.719,	0.031]
  end

  # Cytosine atomic coordinate difference between each atom in the
  # nucleotide compared to the starting one
  def cytosine_delta
    [0,	0, 0, 0.011, 0.412,	1.422, 0.136,	-1.467,	-0.057, -1.289,	0.544, -0.805, -1.749, 1.894,	-0.556, -2.962,	2.232, -1.428, -2.611, 2.179,	-2.819,
     -4.134,	1.244, -1.29, -5.173,	1.837, -0.502, -4.593, 0.982,	-2.709, -3.769,	1.896, -3.603, -3.422, 1.249,	-4.899, -4.071,	1.62,	-6.074, -4.976,	2.408, -6.076,
     -3.709,	1.098, -7.265, -2.774, 0.166,	-7.273, -2.393,	-0.239,	-8.433, -2.136,	-0.305,	-6.106, -2.488,	0.258, -4.931, -0.954, 2.591,	-0.775,
     -2.023,	2.009, 0.477, -3.3,	3.233, -1.205, -3.809, 0.323,	-0.846, -4.395,	-0.043,	-2.951, -5.639,	1.178, -2.839, -4.303, 2.819,	-3.756, -1.656,	-0.895,	-8.516,
     -2.826,	0.177, -9.229, -1.378, -1.062, -6.133, -2.027, -0.051, -4.016]
  end

  # Added spine value for the helix structure for each nucleotide
  def self.lambda; end
end
