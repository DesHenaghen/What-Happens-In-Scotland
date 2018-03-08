import pandas as pd
import numpy as np
import math

Location = r'D:\Libraries\Documents\University\4th Year\CS408 - Individual Project\Projects\survey-results.csv'
df = pd.read_csv(Location)


def printRows(x):
    value_array = []
    for index, row in enumerate(x.values):
        if index != 0 and not math.isnan(float(row)):
            value_array.append(int(row))
        elif index == 0:
            token = str(row.split('(')[0])

    string = '[' + ','.join(str(x) for x in value_array) + ']'
    mean = round(np.mean(value_array), 1)
    std = round(np.std(value_array), 5)
    if std < 2.5:
        print(token + '\t' + str(mean) + '\t' + str(std) + '\t' + string)


df.apply(lambda x: printRows(x))
