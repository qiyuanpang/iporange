import pandas as pd

def df_to_dict(df):
    ans = {}
    for key in df['Date'].keys():
        date = df['Date'][key]
        ans[date] = {'Open': df['Open'][key], 'High': df['High'][key],
                     'Low': df['Low'][key], 'Close': df['Close'][key], 'Volume': int(df['Volume'][key].replace(',', ''))
                    }
    return ans