import re
import string


FILE_PATH = "index.html"
NEW_FILE_PATH = "indexAug.html"
doc = ''

#read file
for line in open(FILE_PATH):
    doc += line

#replace text
for i in range(1,101):
    st = str(i)
    doc = string.replace(doc, "TOFILL_ID", str(i), 1)
    doc = string.replace(doc, "TOFILL_INDEX", "%02d" % i , 1)

print doc

f = open(NEW_FILE_PATH, 'w')
f.write(doc)
f.close()
