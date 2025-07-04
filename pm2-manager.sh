#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_menu() {
    clear
    echo -e "${BLUE}========================================"
    echo -e "           ZDLT PM2 管理工具"
    echo -e "========================================${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} 启动服务"
    echo -e "${GREEN}2.${NC} 停止服务"
    echo -e "${GREEN}3.${NC} 重启服务"
    echo -e "${GREEN}4.${NC} 查看状态"
    echo -e "${GREEN}5.${NC} 查看日志"
    echo -e "${GREEN}6.${NC} 监控面板"
    echo -e "${GREEN}7.${NC} 删除服务"
    echo -e "${GREEN}8.${NC} 保存配置"
    echo -e "${GREEN}9.${NC} 设置开机自启"
    echo -e "${GREEN}10.${NC} 查看系统资源"
    echo -e "${GREEN}0.${NC} 退出"
    echo ""
}

start_service() {
    echo -e "${YELLOW}正在启动服务...${NC}"
    pm2 start ecosystem.config.js --env production
    echo -e "${GREEN}服务启动完成！${NC}"
}

stop_service() {
    echo -e "${YELLOW}正在停止服务...${NC}"
    pm2 stop zdlt-backend
    echo -e "${GREEN}服务已停止！${NC}"
}

restart_service() {
    echo -e "${YELLOW}正在重启服务...${NC}"
    pm2 restart zdlt-backend
    echo -e "${GREEN}服务重启完成！${NC}"
}

show_status() {
    echo -e "${YELLOW}服务状态：${NC}"
    pm2 status
}

show_logs() {
    echo -e "${YELLOW}服务日志：${NC}"
    pm2 logs zdlt-backend --lines 50
}

show_monit() {
    echo -e "${YELLOW}打开监控面板...${NC}"
    pm2 monit
}

delete_service() {
    echo -e "${YELLOW}正在删除服务...${NC}"
    pm2 delete zdlt-backend
    echo -e "${GREEN}服务已删除！${NC}"
}

save_config() {
    echo -e "${YELLOW}正在保存配置...${NC}"
    pm2 save
    echo -e "${GREEN}配置已保存！${NC}"
}

setup_startup() {
    echo -e "${YELLOW}正在设置开机自启...${NC}"
    pm2 startup
    echo -e "${GREEN}开机自启设置完成！${NC}"
}

show_resources() {
    echo -e "${YELLOW}系统资源使用情况：${NC}"
    pm2 show zdlt-backend
}

# 主循环
while true; do
    show_menu
    read -p "请选择操作 (0-10): " choice
    
    case $choice in
        1) start_service ;;
        2) stop_service ;;
        3) restart_service ;;
        4) show_status ;;
        5) show_logs ;;
        6) show_monit ;;
        7) delete_service ;;
        8) save_config ;;
        9) setup_startup ;;
        10) show_resources ;;
        0) echo -e "${GREEN}退出管理工具${NC}"; exit 0 ;;
        *) echo -e "${RED}无效选择，请重试${NC}" ;;
    esac
    
    echo ""
    read -p "按回车键继续..."
done 