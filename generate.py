# -*- coding: utf-8 -*-
import codecs
import csv
import os
from collections import defaultdict, Counter
from os import path
from mako.template import Template


indexhtml_tmpl = Template(filename="./tmpl/index.mako",
                          input_encoding='utf-8',
                          output_encoding='utf-8')

def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.DictReader(utf_8_encoder(unicode_csv_data),
                                dialect=dialect, **kwargs)

    row_index = 1  # data start at row 2 (row 1 is header)
    for row in csv_reader:
        for k, v in row.iteritems():
            row[k] = unicode(v, 'utf-8')

        yield row_index, row
        row_index += 1


def utf_8_encoder(unicode_csv_data):
    for line in unicode_csv_data:
        yield line.encode('utf-8')


def read_csv():
    """
    return (list(poster), taxonomy_dict)
    """
    posters = []
    taxnomony = []

    with codecs.open("./site_data_csv/posters.csv", 'rb', "utf-8") as csvfile:
        for row_index, row in unicode_csv_reader(csvfile):
            poster = dict(
                id = row_index,
                zh_name = row["作品中文名稱"],
                en_name = row["作品英文名稱"],
                year = row["年份"],
                client = row["客戶資訊"],
                description = row["作品敘述"],
                poster_file_name = row["作品照片檔案名稱"])

            posters.append(poster)

    with codecs.open("./site_data_csv/taxonomy.csv", 'rb', "utf-8") as csvfile:
        for row_index, row in unicode_csv_reader(csvfile):
            poster_id_list = [int(_.strip()) for _ in row["海報編號"].split(",")]

            t = dict(
                id = row_index,
                zh_name = row["議題中文抬頭"],
                en_name = row["議題英文抬頭"],
                poster_ids = poster_id_list)

            taxnomony.append(t)

    for poster in posters:
        poster_tax_list = [];
        for tax in taxnomony:
            if poster["id"] not in tax["poster_ids"]:
                continue

            poster_tax_list.append(dict(
                id = tax["id"],
                zh_name = tax["zh_name"],
                en_name = tax["en_name"]
            ))

        poster["taxnomony_list"] = poster_tax_list

    return posters


def generate_index_html(poster):
    html = indexhtml_tmpl.render(posters=posters)

    with open("./index.html", "w") as f:
        f.write(html)


if __name__ == '__main__':
    posters = read_csv()
    generate_index_html(posters)
