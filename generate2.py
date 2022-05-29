import numpy as np

POS_BASE = 0.4
CM_CENTER_DS = POS_BASE + 0.2
BASE_BASE = 0.3897628551303122

def get_rotation_matrix(axis, anglest):
    # the argument anglest can be either an angle in radiants
    # (accepted types are float, int or np.float64 or np.float64)
    # or a tuple [angle, units] where angle a number and
    # units is a string. It tells the routine whether to use degrees,
    # radiants (the default) or base pairs turns
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
        angle = float(anglest) # in degrees, I think

    axis = np.array(axis)
    axis /= np.sqrt(np.dot(axis, axis))

    ct = np.cos(angle)
    st = np.sin(angle)
    olc = 1. - ct
    x, y, z = axis

    return np.array([[olc*x*x+ct, olc*x*y-st*z, olc*x*z+st*y],
                    [olc*x*y+st*z, olc*y*y+ct, olc*y*z-st*x],
                [olc*x*z-st*y, olc*y*z+st*x, olc*z*z+ct]])

def generate(bp, start_pos, dir, R, R0, is_y=False, perp=False, a1=None, a3=None, rb=None):
    # new_position, new_a1, new_a3 = [], [], []

    # dir /= np.sqrt(np.dot(dir,dir))
    if perp is None or perp is False:
        v1 = np.random.random_sample(3)
        v1 -= dir * (np.dot(dir, v1))
        v1 /= np.sqrt(sum(v1*v1))
    else:
        v1 = perp

    if a1 is None:
        a1 = v1
        a1 = np.dot (R0, a1)
        rb = np.array(start_pos)
        a3 = dir
    else:
        # if dir_ch == "x":
        #     start_pos[0] += (rb - CM_CENTER_DS * a1)[0]
        # elif dir_ch == "z":
        #     start_pos[2] += (rb - CM_CENTER_DS * a1)[2]
        # elif dir_ch == "y":
        #     start_pos[1] += (rb - CM_CENTER_DS * a1)[1]
        i = 1 if not is_y else 2
        # if dir_ch == "x":
        #     if dir_ch_prev == "y":
        #         i = 2
        #     else:
        #         i = 1
        # elif dir_ch == "y":
        #     # i = 2
        #     if dir_ch_prev == "x":
        #         i = 2
        #     else:
        #         i = 1
        # elif dir_ch == "z":
        #     if dir_ch_prev == "y":
        #         i = 2
        #     else:
        #         i = 1

        start_pos[i] = (rb - CM_CENTER_DS * a1)[i]
        a1 = np.dot(R, a1)
        rb += a3 * BASE_BASE
        a3 = a3

    # new_position.append(start_pos)
    # new_a1.append(a1)
    # new_a3.append(a3)

    return [start_pos, a1, a3, rb]

sequence = "A" * 7249

### with dir=(0, 1, 0) --> start_pos[2]
### with dir=(0, 0, 1) --> start_pos[1]
### with dirX and start_pos[1] goes to depth 5'
### with dirY and start_pos[2] goes vertically 5'
### with dirZ and start_pos[1] goes horizontally 5'
def get_dir_ch(v1, v2):
    max_of = 0
    max_dir = "x"
    
    if abs(v1[0] - v2[0]) > max_of:
        max_of = abs(v1[0] - v2[0])
        max_dir = "x"
    elif abs(v1[1] - v2[1]) > max_of:
        max_of = abs(v1[1] - v2[1])
        max_dir = "y"
    elif abs(v1[2] - v2[2]) > max_of:
        max_of = abs(v1[2] - v2[2])
        max_dir = "z"
    return max_dir

import json

f = open("./app/assets/results/test_posz.json")
data = json.load(f)['positions']
f.close()

i = 0
test_positions = []
while i < len(data):
    test_positions.append([data[i], data[i+1], data[i+2]])
    i += 3

test_positions = test_positions
# test_positions = test_positions[:5] + test_positions[6:]
# print(test_positions)
all_positions, all_a1s, all_a3s = [], [], []

dirX = np.array([1, 0, 0], dtype=float)
dirZ = np.array([0, 0, 1], dtype=float) 
dirY = np.array([0, 1, 0], dtype=float)
curr_dir = dirZ

# dir = np.array([0, 0, 1], dtype=float)
rot = 0.0

R0X = get_rotation_matrix(dirX, rot)
RX = get_rotation_matrix(dirX, [1, "bp"])

R0Y = get_rotation_matrix(dirY, rot)
RY = get_rotation_matrix(dirY, [1, "bp"])

R0Z = get_rotation_matrix(dirZ, rot)
RZ = get_rotation_matrix(dirZ, [1, "bp"])


R0 = get_rotation_matrix(dirX, rot)
R = get_rotation_matrix(dirX, [1, "bp"])
a1 = None
a3 = dirZ
rb = None
# dir_ch = "x"
# dir_ch_prv = "x"
# dir_ch_nxt = "x"

# last_ch = "x"

curr_R0 = R0X
curr_R = RX
curr_a3 = dirX
is_y = False
dir_ch = "x"
dir_ch_prv = "x"

for i, seq in enumerate(test_positions):
    
    # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, a1=a1, a3=a3, rb=rb) # for z change
    # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirY, RY, R0Y, a1=a1, a3=a3, rb=rb)
    # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, dir_ch="x", a1=a1, a3=a3, rb=rb)
    # if dir_ch == "x":
    #     # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirZ, RZ, R0Z, dir_ch="z", a1=a1, a3=a3, rb=rb)
    #     position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, dir_ch="x", a1=a1, a3=a3, rb=rb)
    # elif dir_ch == "y":
    #     position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirY, RY, R0Y, dir_ch="y", a1=a1, a3=a3, rb=rb)
    # elif dir_ch == "z":
    
    # print(dir_ch)
    dir_ch_prv = get_dir_ch(test_positions[i - 1% len(test_positions)], test_positions[i-2]) if (i != 0) else dir_ch_prv
    dir_ch = get_dir_ch(test_positions[i% len(test_positions)], test_positions[i-1]) if (i != 0) else dir_ch
    
    if dir_ch != dir_ch_prv:
        a1 = None
        if dir_ch == "x":
            curr_R0 = R0X
            curr_R = RX
            curr_a3 = dirX
            is_y = False
        elif dir_ch == "y":
            curr_R0 = R0Y
            curr_R = RY
            curr_a3 = dirY
            is_y = True
        else:
            curr_R0 = R0Z
            curr_R = RZ
            curr_a3 = dirZ
            is_y = False
    
    position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), curr_a3, curr_R, curr_R0, is_y=is_y, a1=a1, a3=curr_a3, rb=rb)
    print(position, i)
    # print(dir_ch, dir_ch_prv, test_positions[i], i)
    # if dir_ch == "z":
    #     if dir_ch != dir_ch_prv:
    #         # print(dir_ch, dir_ch_prv)
    #         last_ch = dir_ch_prv
    #         print(last_ch)
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirZ, RZ, R0Z, dir_ch="z", dir_ch_prev=last_ch, a1=None, a3=dirZ, rb=rb)
    #     else:
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirZ, RZ, R0Z, dir_ch="z", dir_ch_prev=last_ch, a1=a1, a3=dirZ, rb=rb)
    # elif dir_ch == "y":
    #     if dir_ch != dir_ch_prv:
    #         last_ch = dir_ch_prv
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirY, RY, R0Y, dir_ch="y", dir_ch_prev=last_ch, a1=None, a3=dirY, rb=rb)
    #     else:
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirY, RY, R0Y, dir_ch="y", dir_ch_prev=last_ch, a1=a1, a3=dirY, rb=rb)
    #     # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, dir_ch="x", a1=a1, a3=a3, rb=rb)
    # else:
    #     if dir_ch != dir_ch_prv:
    #         last_ch = dir_ch_prv
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, dir_ch="x", dir_ch_prev=last_ch, a1=None, a3=dirX, rb=rb)
    #     else:
    #         position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, RX, R0X, dir_ch="x", dir_ch_prev=last_ch,  a1=a1, a3=dirX, rb=rb)

        # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirY, RY, R0Y, dir_ch="y", a1=a1, a3=a3, rb=rb)
    # position, a1, a3, rb = generate(len(seq), np.array(test_positions[i], dtype=float), dirX, a1=a1, a3=a3, rb=rb)
    # print(position)
    all_positions += [position]
    all_a1s += [a1]
    all_a3s += [a3]
    


f = open("demo.dat", "w")
f.write("t = 0\n")
f.write("b = 1000.0 1000.0 1000.0\n")
f.write("E = 0. 0. 0.\n")

for i in range(len(all_positions)):
    f.write(f"{all_positions[i][0]} {all_positions[i][1]} {all_positions[i][2]} {all_a1s[i][0]} {all_a1s[i][1]} {all_a1s[i][2]} {all_a3s[i][0]} {all_a3s[i][1]} {all_a3s[i][2]} 0.0 0.0 0.0 0.0 0.0 0.0\n")
f.close()


f = open("demo.top", "w")
f.write(f"{len(sequence[:len(test_positions)])} 1\n")
for i in range(len(test_positions)):
    f.write(f"1 {sequence[i]} {i - 1} {i + 1 if i + 1 < len(test_positions) else -1}\n")
f.close()
