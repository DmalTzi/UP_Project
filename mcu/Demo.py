from esp8266_i2c_lcd import I2cLcd
from servo import Servos
from machine import Pin, I2C
import time

serial = ''
pos_para = 0
pos_men = 0
pos_etc = 0


KEYS = [
    ['D', 'C', 'B', 'A'],
    ['#', '9', '6', '3'],
    ['0', '8', '5', '2'],
    ['*', '7', '4', '1']]

COLUMN_BITS = [0b01111111,0b10111111,0b11011111,0b11101111]

def scan_keypad(i2c, addr):
    buf = bytearray(1)
    keys = []
    for row in range(4):
        buf[0] = COLUMN_BITS[ row ]
        i2c.writeto(addr, buf)
        x = i2c.readfrom(addr,1)[0] & 0xf
        if (~x & 0xf) not in [1,2,4,8]:
            continue
        col = -1
        for i in range(4): 
            if (x>>i) & 1 == 0:
                col = (3-i)
                break
        if col >= 0:
            key = KEYS[row][col]
            # print("R{}='{:>04s}'".format(row+1,bin(x)[2:]))
            keys.append(key)
    return keys

def servo_para(pos_para):
    if pos_para == 0:
        return 1
    elif pos_para == 1:
        return 0

def servo_men(pos_men):
    if pos_men == 0:
        return 1
    elif pos_men == 1:
        return 0
    
def servo_etc(pos_etc):
    if pos_etc == 0:
        return 1
    elif pos_etc == 1:
        return 0

i2c = I2C(scl=Pin(5),sda=Pin(4),freq=100000) # i2c for lcd and kaeypad

i2cfs = I2C(scl=Pin(5), sda=Pin(4)) # i2c for servo
servos = Servos(i2cfs) # assign class

lcd = I2cLcd(i2c, 0x27, 2, 16)
lcd.clear()
lcd.putstr(f'Input Serial\n{serial}')
addr = 0x20 #Keypad
try:
    while True:
        keys = scan_keypad(i2c,addr)
        if len(keys) >= 1:
            print(pos_para)
            if keys[0] == 'A':
                lcd.clear()
                lcd.putstr(f'Check data')
                print(serial)
                time.sleep(2)
                if serial == '072301':
                    print('im in')
                    pos_para = servo_para(pos_para)
                    print(pos_para)
                    servos.position(0, degrees=pos_para*180)
                elif serial == '072302':
                    pos_men = servo_men(pos_men)
                    servos.position(1, degrees=pos_men*180)
                elif serial == '072303':
                    pos_etc = servo_etc(pos_etc)
                    servos.position(2, degrees=pos_etc*180)
                lcd.clear()
                serial = ''
                lcd.putstr(f'Input Serial\n{serial}')
                continue
            print(f"this is a key : {keys[0]}")
            serial += keys[0]
            lcd.clear()
            lcd.putstr(f'Input Serial\n{serial}')
        time.sleep(.5)       
except KeyboardInterrupt:
    pass
finally:
    print('Done')
    lcd.clear()
    print(serial)

