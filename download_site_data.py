#!/usr/bin/env python
import requests

def download_csv(sheet_key, sheet_id, dest_path):
    url = ('https://docs.google.com/spreadsheets/d/{0}/export?'
           'format=csv&gid={1}'.format(sheet_key, sheet_id))

    print "Fetching file %s" % (dest_path)

    res = requests.get(url)
    if not res.status_code == 200:
        raise Exception("Unble to fetch the doc from %s" % url);

    res.encoding = "utf-8"  # google returns ISO-8859-1. change it to utf-8
    with open(dest_path, "w") as f:
        f.write(res.text.encode("utf8"))


if __name__ == '__main__':
    download_csv("1P9KfbUllbNBG2Z3LvldUEW0ukx-RQOyQMDXMpFRGDrU", 0, "./site_data_csv/posters.csv")
    download_csv("1P9KfbUllbNBG2Z3LvldUEW0ukx-RQOyQMDXMpFRGDrU", "160186187", "./site_data_csv/taxonomy.csv")

