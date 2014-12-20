for name in `ls | grep _with_ann.csv`; do cat $name | ./transpose_csv.py > ${name/_with_ann/_with_ann_xpose}; done;
