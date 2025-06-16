"""
Some utility helpers
"""

import pandas as pd
import numpy as np

def encode_row(series: pd.Series, cat_maps: dict, cat_cols: list, num_cols: list):
    """
    Turn an entry into the two chunks the model needs:
    - cat: list of integer IDs for every categorical field
    - num: NumPy float32 numeric field
    """
    cat = [cat_maps[c][series[c]] for c in cat_cols]
    num = series[num_cols].astype(np.float32).values
    return cat, num