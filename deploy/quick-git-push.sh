#!/bin/bash
# 一键提交并推送到GitHub

git add .
now=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "auto commit: $now"
git push

echo "已自动提交并推送到GitHub: $now" 