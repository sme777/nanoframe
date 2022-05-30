import numpy as np

POS_BASE = 0.4
CM_CENTER_DS = POS_BASE + 0.2
BASE_BASE = 0.3897628551303122

def get_rotation_matrix(axis, anglest):
    if not isinstance (anglest, (np.float64, np.float32, float, int)):
        if len(anglest) > 1:
            if anglest[1] in ["degrees", "deg", "o"]:
                #angle = np.deg2rad (anglest[0])
                angle = (np.pi / 180.) * (anglest[0])
            elif anglest[1] in ["bp"]:
                angle = int(anglest[0]) * (np.pi / 180.) * (35.9)
            else:
                angle = float(anglest[0])
        else:
            angle = float(anglest[0])
    else:
        angle = float(anglest)

    axis = np.array(axis)
    axis /= np.sqrt(np.dot(axis, axis))

    ct = np.cos(angle)
    st = np.sin(angle)
    olc = 1. - ct
    x, y, z = axis

    return np.array([[olc*x*x+ct, olc*x*y-st*z, olc*x*z+st*y],
                    [olc*x*y+st*z, olc*y*y+ct, olc*y*z-st*x],
                [olc*x*z-st*y, olc*y*z+st*x, olc*z*z+ct]])

def generate(bp, start_pos, dir, R, R0, is_y=False, perp=False, a1=None, a3=None, rb=None, a1_d=None, a3_d=None, rb_d=None):
    if perp is None or perp is False:
        v1 = np.random.random_sample(3)
        v1 -= dir * (np.dot(dir, v1))
        v1 /= np.sqrt(sum(v1*v1))
    else:
        v1 = perp
    start_pos_d = start_pos
    i = 1 if not is_y else 2
    if a1 is None:
        a1 = v1
        a1 = np.dot (R0, a1)
        rb = np.array(start_pos)
        a3 = dir
    else:
        
        start_pos = (rb - CM_CENTER_DS * a1)
        a1 = np.dot(R, a1)
        rb += a3 * BASE_BASE
        a3 = a3

    a1_d = -a1
    a3_d = -a3
    start_pos_d = (rb - CM_CENTER_DS * a1_d)

    return [start_pos, a1, a3, rb, start_pos_d, a1_d, a3_d]

sequence = "A" * 7249
sequence2 = "T" * 7249

def get_dir_ch(v1, v2):
    max_of = 0
    max_dir = "x"
    direction = 0
    
    if abs(v1[0] - v2[0]) > max_of:
        max_of = abs(v1[0] - v2[0])
        direction = v1[0] - v2[0]
        max_dir = "x"
    elif abs(v1[1] - v2[1]) > max_of:
        max_of = abs(v1[1] - v2[1])
        direction = v1[1] - v2[1]
        max_dir = "y"
    elif abs(v1[2] - v2[2]) > max_of:
        max_of = abs(v1[2] - v2[2])
        direction = v1[2] - v2[2]
        max_dir = "z"
    return max_dir, direction

def find_closest_nt(staple_nt, scaffold_nts_map):

    min_dist = float('inf')
    closest_nt = None
    closest_a1 = None
    closest_a3 = None

    for nt in scaffold_nts_map:
        nt2 = np.array([nt[0], nt[1], nt[2]])
        dist = np.linalg.norm(nt2-staple_nt)
        if dist < min_dist:
            min_dist = dist
            closest_nt = nt2
            closest_a1 = scaffold_nts_map[nt][0]
            closest_a3 = scaffold_nts_map[nt][1]

    return closest_nt, closest_a1, closest_a3

def setup(positions):
    all_positions, all_a1s, all_a3s = [], [], []
    all_d_positions, all_d_a1s, all_d_a3s = [], [], []
    dirX = np.array([1, 0, 0], dtype=float)
    dirZ = np.array([0, 0, 1], dtype=float) 
    dirY = np.array([0, 1, 0], dtype=float)
    curr_dir = dirZ

    rot = 0.0

    R0X = get_rotation_matrix(dirX, rot)
    RX = get_rotation_matrix(dirX, [1, "bp"])

    R0Y = get_rotation_matrix(dirY, rot)
    RY = get_rotation_matrix(dirY, [1, "bp"])

    R0Z = get_rotation_matrix(dirZ, rot)
    RZ = get_rotation_matrix(dirZ, [1, "bp"])

    a1 = None
    a1_d = None
    a3 = dirZ
    a3_d = -a3
    rb = None
    rb_d = None

    curr_R0 = R0X
    curr_R = RX
    curr_a3 = dirX
    is_y = False
    dir_ch = "x"
    dir_ch_prv = "x"
    Rs = []
    rbs = []
    scaffold_nts_map = {}
    for i, seq in enumerate(positions):
        
        if (i != 0):
            dir_ch_prv, _ = get_dir_ch(positions[i - 1% len(positions)], positions[i-2])
        else:
            dir_ch_prv = dir_ch_prv

        if (i != 0):
            dir_ch, dir_vec = get_dir_ch(positions[i% len(positions)], positions[i-1])
        else:
            dir_ch = dir_ch
        
        if dir_ch != dir_ch_prv:
            a1 = None
            if dir_ch == "x":
                curr_R0 = R0X
                curr_R = RX
                curr_a3 = dirX if dir_vec > 0 else -dirX
                is_y = False
            elif dir_ch == "y":
                curr_R0 = R0Y
                curr_R = RY
                curr_a3 = dirY if dir_vec > 0 else -dirY
                is_y = True
            else:
                curr_R0 = R0Z
                curr_R = RZ
                curr_a3 = dirZ if dir_vec > 0 else -dirZ
                is_y = False
        
        position, a1, a3, rb, position_d, a1_d, a3_d = generate(len(seq), np.array(positions[i], dtype=float), curr_a3, curr_R, curr_R0, is_y=is_y, a1=a1, a3=curr_a3, rb=rb)
        rbs += [rb]
        all_positions += [position]
        # all_d_positions += [position_d]
        all_a1s += [a1]
        # all_d_a1s += [a1_d]
        all_a3s += [a3]
        # all_d_a3s += [a3_d]
        scaffold_nts_map[(position_d[0], position_d[1], position_d[2])] = [a1_d, a3_d]



    return all_positions, all_a1s, all_a3s, scaffold_nts_map #all_d_positions, all_d_a1s, all_d_a3s
        

def setup2(positions):
    new_positions = []
    new_a1s = []
    new_a3s = []
    for nt in positions:
        pos, a1, a3 = find_closest_nt(nt, scaffold_nts_map)
        new_positions.append(pos)
        new_a1s.append(a1)
        new_a3s.append(a3)
    return new_positions, new_a1s, new_a3s
import json
### SCAFFOLD ###

f = open("../assets/results/test_posz.json")
data = json.load(f)['positions']
f.close()

# first filter data
clean_data = []
i = 0
while i < len(data):
    clean_data += [data[i], data[i+1], data[i+2]]
    if i + 5 > len(data) - 1:
        i += 3
        continue
    #     clean_data += [data[i], data[i+1], data[i+2]]
    if data[i] == data[i+3] and data[i+1] == data[i+4] and data[i+2] == data[i+5]:
        i += 6
    else:
        i += 3
        # clean_data += [data[i], data[i+1], data[i+2]]


i = 0
test_positions = []
while i < len(clean_data):
    test_positions.append([clean_data[i], clean_data[i+1], clean_data[i+2]])
    i += 3
# test_positions = test_positions[:200]
all_positions, all_a1s, all_a3s, scaffold_nts_map = setup(test_positions)

### STAPLES ###

f = open("../assets/results/staple_posz.json")
staple_data = json.load(f)['positions']
f.close()
# print(len(staple_data[0]))

staples_positions = []
staples_a1s = []
staple_a3s = []
w = 0
for i in range(len(staple_data)):
    # print(i)
    j = 0
    staple_group = staple_data[i]
    staple_position = []
    while j < len(staple_group):
        staple_position.append([staple_group[j], staple_group[j+1], staple_group[j+2]])
        j += 3
    # print(len(staple_position))
    print(i)
    sall_positions, sall_a1s, sall_a3s = setup2(staple_position)
    staples_positions.append(sall_positions)
    staples_a1s.append(sall_a1s)
    staple_a3s.append(sall_a3s)
    w += len(staple_group) // 3

# print(len(staples_positions[0]))
staple_sequence = "T" * w
comb_seq = sequence + staple_sequence
print(len(comb_seq))
f = open("demo.dat", "w")
f.write("t = 0\n")
f.write("b = 1000.0 1000.0 1000.0\n")
f.write("E = 0. 0. 0.\n")

for i in range(len(all_positions)):
    f.write(f"{all_positions[i][0]} {all_positions[i][1]} {all_positions[i][2]} {all_a1s[i][0]} {all_a1s[i][1]} {all_a1s[i][2]} {all_a3s[i][0]} {all_a3s[i][1]} {all_a3s[i][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")

# for i in range(len(all_positions)):
#     f.write(f"{all_d_positions[i][0]} {all_d_positions[i][1]} {all_d_positions[i][2]} {all_d_a1s[i][0]} {all_d_a1s[i][1]} {all_d_a1s[i][2]} {all_d_a3s[i][0]} {all_d_a3s[i][1]} {all_d_a3s[i][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")



for j in range(len(staples_positions)):
    # print(staples_positions[j])
    w = 0
    while w < len(staples_positions[j]):
    # for w in range():
            # print(f"{j+2} {comb_seq[i]} {i - 1 if w != 0 else -1} {i + 1 if (i + 1 < len(comb_seq) or w == len(staples_positions[j]) - 1) else -1}")
        # i += 1
        f.write(f"{staples_positions[j][w][0]} {staples_positions[j][w][1]} {staples_positions[j][w][2]} {staples_a1s[j][w][0]} {staples_a1s[j][w][1]} {staples_a1s[j][w][2]} {staple_a3s[j][w][0]} {staple_a3s[j][w][1]} {staple_a3s[j][w][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")
        # if w == 0:
        #     print(j)
        # f.write(f"{j+2} {comb_seq[i]} {i - 1 if w != 0 else -1} {i + 1 if (w != len(staples_positions[j]) - 1) else -1}\n")
        w += 1

f.close()


f = open("demo.top", "w")
f.write(f"{len(comb_seq)} {1 + len(staple_data)}\n")
for i in range(len(test_positions)):
    f.write(f"1 {sequence[i]} {i - 1} {i + 1 if i + 1 < len(test_positions) else -1}\n")

# for j in range(len(test_positions)):
#     i += 1
#     # f.write(f"2 {sequence2[i]} {i - 1} {i + 1 if i + 1 < len(test_positions) else -1}\n")
#     f.write(f"2 {sequence2[j]} {i - 1 if j != 0 else -1} {i + 1 if (j != len(test_positions) - 1) else -1}\n")

for j in range(len(staples_positions)):
    # print(staples_positions[j])
    w = 0
    while w < len(staples_positions[j]):
    # for w in range():
            # print(f"{j+2} {comb_seq[i]} {i - 1 if w != 0 else -1} {i + 1 if (i + 1 < len(comb_seq) or w == len(staples_positions[j]) - 1) else -1}")
        i += 1
        # if w == 0:
        #     print(j)
        f.write(f"{j+2} {comb_seq[i]} {i - 1 if w != 0 else -1} {i + 1 if (w != len(staples_positions[j]) - 1) else -1}\n")
        w += 1

f.close()




# i = 0
# staple_positions = []
# while i < len(staple_data[0]):
#     staple_positions.append([staple_data[i], staple_data[i+1], staple_data[i+2]])
#     i += 3

# sall_positions, sall_a1s, sall_a3s = setup(staple_positions)


# f = open("staple.dat", "w")
# f.write("t = 0\n")
# f.write("b = 1000.0 1000.0 1000.0\n")
# f.write("E = 0. 0. 0.\n")

# for i in range(len(sall_positions)):
#     f.write(f"{sall_positions[i][0]} {sall_positions[i][1]} {sall_positions[i][2]} {sall_a1s[i][0]} {sall_a1s[i][1]} {sall_a1s[i][2]} {sall_a3s[i][0]} {sall_a3s[i][1]} {sall_a3s[i][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")
# f.close()


# f = open("staple.top", "w")
# f.write(f"{len(sequence[:len(staple_positions)])} 1\n")
# for i in range(len(staple_positions)):
#     f.write(f"1 {sequence[i]} {i - 1} {i + 1 if i + 1 < len(staple_positions) else -1}\n")
# f.close()


