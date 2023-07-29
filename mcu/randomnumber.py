import random

para_box_code = []

num = '767'

for i in range(100):
    a = random.randint(1,9)
    b = random.randint(1,9)
    c = random.randint(1,9)
    num+=f"{a}{b}{c}"
    para_box_code.append(num)
    num = '767'

print(para_box_code)