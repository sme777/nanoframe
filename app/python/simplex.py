import numpy as np 
from fractions import Fraction # so that numbers are not displayed in decimal.

def simplex(A, b, c, cb, B, TYPE='MAX'):
    '''
    Return Results
         0: Solution Found
        -1: Unbounded Linear Program
    '''
    cb = np.vstack((cb, c[2]))        
    xb = np.transpose([b])                 
    table = np.hstack((B, cb))             
    table = np.hstack((table, xb))         

    table = np.hstack((table, A))         
    table = np.array(table, dtype ='float') 

    reached = 0     
    itr = 1
    unbounded = 0
    alternate = 0
    
    while reached == 0:
    
    
        # calculate Relative profits-> cj - zj for non-basics
        i = 0
        rel_prof = []
        while i<len(A[0]):
            rel_prof.append(c[i] - np.sum(table[:, 1]*table[:, 3 + i]))
            i = i + 1

        i = 0
        
        b_var = table[:, 0]
        # checking for alternate solution
        while i<len(A[0]):
            j = 0
            present = 0
            while j<len(b_var):
                if int(b_var[j]) == i:
                    present = 1
                    break;
                j+= 1
            if present == 0:
                if rel_prof[i] == 0:
                    alternate = 1

            i+= 1

        flag = 0
        for profit in rel_prof:
            if profit>0:
                flag = 1
                break
            # if all relative profits <= 0
        if flag == 0:
            reached = 1
            break
    
        k = rel_prof.index(max(rel_prof))
        min = 99999
        i = 0;
        r = -1
        while i<len(table):
            if (table[:, 2][i]>0 and table[:, 3 + k][i]>0): 
                val = table[:, 2][i]/table[:, 3 + k][i]
                if val<min:
                    min = val
                    r = i     
            i+= 1
    
        if r ==-1:
            unbounded = 1
            break
    
        pivot = table[r][3 + k]  
        table[r, 2:len(table[0])] = table[
                r, 2:len(table[0])] / pivot
                
        i = 0
        while i<len(table):
            if i != r:
                table[i, 2:len(table[0])] = table[i, 2:len(table[0])] - table[i][3 + k] * table[r, 2:len(table[0])]
            i += 1
    
        table[r][0] = k
        table[r][1] = c[k]
        itr+= 1
      
  
    if unbounded == 1:
        return -1
    if alternate == 1:
        print("ALTERNATE Solution")
  
    basis = []
    i = 0
    sum = 0

    while i<len(table):
        sum += c[int(table[i][0])]*table[i][2]
        temp = "x"+str(int(table[i][0])+1)
        basis.append(temp)
        i+= 1

    if TYPE == "MIN":
        print(-Fraction(str(sum)).limit_denominator(100))
    else:
        print(Fraction(str(sum)).limit_denominator(100))

    return basis
  