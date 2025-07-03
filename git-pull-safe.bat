@echo off
echo 正在安全地执行 git pull，保护 agents.json...

REM 备份当前的 agents.json
if exist backend\agents.json (
    copy backend\agents.json backend\agents.json.backup
    echo 已备份 agents.json
)

REM 执行 git pull
git pull

REM 恢复 agents.json
if exist backend\agents.json.backup (
    copy backend\agents.json.backup backend\agents.json
    del backend\agents.json.backup
    echo 已恢复 agents.json
)

echo git pull 完成，agents.json 已保护
pause 