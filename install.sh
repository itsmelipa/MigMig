#!/bin/bash
# ╔══════════════════════════════════════════════════╗
# ║         MigMig Panel — One-Line Installer        ║
# ║              🦐 migmig.net                       ║
# ╚══════════════════════════════════════════════════╝

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

INSTALL_DIR="/opt/migmig"
SERVICE_NAME="migmig"
PORT="${PORT:-3000}"
REPO="https://github.com/YOUR_USERNAME/migmig-panel"

print_banner() {
  echo ""
  echo -e "${CYAN}${BOLD}"
  echo "  ███╗   ███╗██╗ ██████╗    ███╗   ███╗██╗ ██████╗ "
  echo "  ████╗ ████║██║██╔════╝    ████╗ ████║██║██╔════╝ "
  echo "  ██╔████╔██║██║██║  ███╗   ██╔████╔██║██║██║  ███╗"
  echo "  ██║╚██╔╝██║██║██║   ██║   ██║╚██╔╝██║██║██║   ██║"
  echo "  ██║ ╚═╝ ██║██║╚██████╔╝   ██║ ╚═╝ ██║██║╚██████╔╝"
  echo "  ╚═╝     ╚═╝╚═╝ ╚═════╝    ╚═╝     ╚═╝╚═╝ ╚═════╝ "
  echo -e "${NC}"
  echo -e "  ${YELLOW}پنل مدیریت کانفیگ VPN${NC}  |  v2.1.0"
  echo ""
}

step() { echo -e "\n${CYAN}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
err()  { echo -e "${RED}✗ خطا: $1${NC}"; exit 1; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }

check_root() {
  if [[ $EUID -ne 0 ]]; then
    err "این اسکریپت باید با root اجرا بشه.\nدستور: sudo bash install.sh"
  fi
}

detect_os() {
  if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    OS=$ID
    VER=$VERSION_ID
  else
    err "سیستم‌عامل شناخته‌نشده"
  fi
  ok "سیستم‌عامل: $PRETTY_NAME"
}

install_node() {
  if command -v node &>/dev/null; then
    NODE_VER=$(node -v)
    ok "Node.js از قبل نصبه: $NODE_VER"
    return
  fi
  step "نصب Node.js 20..."
  case $OS in
    ubuntu|debian)
      apt-get update -qq
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &>/dev/null
      apt-get install -y nodejs &>/dev/null
      ;;
    centos|rhel|fedora|rocky|almalinux)
      curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - &>/dev/null
      yum install -y nodejs &>/dev/null || dnf install -y nodejs &>/dev/null
      ;;
    *)
      err "توزیع پشتیبانی‌نشده: $OS\nلطفاً Node.js 18+ رو دستی نصب کن."
      ;;
  esac
  ok "Node.js $(node -v) نصب شد"
}

install_git() {
  if command -v git &>/dev/null; then return; fi
  step "نصب git..."
  case $OS in
    ubuntu|debian) apt-get install -y git &>/dev/null ;;
    *) yum install -y git &>/dev/null || dnf install -y git &>/dev/null ;;
  esac
  ok "git نصب شد"
}

clone_or_update() {
  step "دانلود پنل میگ‌میگ..."
  if [[ -d "$INSTALL_DIR/.git" ]]; then
    warn "نسخه قبلی پیدا شد — آپدیت می‌کنم..."
    cd "$INSTALL_DIR" && git pull origin main &>/dev/null
    ok "آپدیت شد"
  else
    git clone "$REPO" "$INSTALL_DIR" &>/dev/null
    ok "دانلود شد در $INSTALL_DIR"
  fi
}

build_panel() {
  step "نصب پکیج‌ها و build..."
  cd "$INSTALL_DIR"
  npm install --silent
  npm run build --silent
  ok "Build موفق"
}

install_serve() {
  if ! command -v serve &>/dev/null; then
    npm install -g serve --silent
  fi
}

setup_systemd() {
  step "راه‌اندازی سرویس systemd..."
  cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=MigMig VPN Panel
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/npx serve dist -p ${PORT} -s
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable "$SERVICE_NAME" &>/dev/null
  systemctl restart "$SERVICE_NAME"
  ok "سرویس فعال شد"
}

open_firewall() {
  if command -v ufw &>/dev/null; then
    ufw allow "$PORT"/tcp &>/dev/null && ok "پورت $PORT در ufw باز شد"
  elif command -v firewall-cmd &>/dev/null; then
    firewall-cmd --permanent --add-port="$PORT"/tcp &>/dev/null
    firewall-cmd --reload &>/dev/null
    ok "پورت $PORT در firewalld باز شد"
  fi
}

get_ip() {
  curl -s https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}'
}

print_done() {
  IP=$(get_ip)
  echo ""
  echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}${BOLD}  ✅  پنل میگ‌میگ با موفقیت نصب شد!${NC}"
  echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  🌐 آدرس پنل:   ${CYAN}${BOLD}http://${IP}:${PORT}${NC}"
  echo ""
  echo -e "  دستورات مفید:"
  echo -e "  ${YELLOW}systemctl status $SERVICE_NAME${NC}   وضعیت سرویس"
  echo -e "  ${YELLOW}systemctl restart $SERVICE_NAME${NC}  ریستارت"
  echo -e "  ${YELLOW}systemctl stop $SERVICE_NAME${NC}     توقف"
  echo -e "  ${YELLOW}journalctl -u $SERVICE_NAME -f${NC}   لاگ‌ها"
  echo ""
  echo -e "  برای تغییر پورت:"
  echo -e "  ${YELLOW}PORT=8080 bash <(curl -Ls $REPO/raw/main/install.sh)${NC}"
  echo ""
}

# ── Run ───────────────────────────────────────────────────────────────────────
print_banner
check_root
detect_os
install_git
install_node
clone_or_update
build_panel
install_serve
setup_systemd
open_firewall
print_done
