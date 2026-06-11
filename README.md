<div align="center">

# 🦐 میگ‌میگ پنل

**پنل مدیریت و فروش کانفیگ VPN**

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)

</div>

---

## ⚡ نصب یک‌خطی

```bash
bash <(curl -Ls https://raw.githubusercontent.com/YOUR_USERNAME/migmig-panel/main/install.sh)
```

> نیاز به دسترسی root دارد. روی Ubuntu، Debian، CentOS، Rocky و AlmaLinux تست شده.

---

## 🐳 نصب با Docker

```bash
docker run -d -p 3000:3000 --name migmig --restart unless-stopped ghcr.io/YOUR_USERNAME/migmig-panel
```

یا با docker-compose:

```bash
git clone https://github.com/YOUR_USERNAME/migmig-panel && cd migmig-panel && docker compose up -d
```

---

## 🔧 تغییر پورت

```bash
PORT=8080 bash <(curl -Ls https://raw.githubusercontent.com/YOUR_USERNAME/migmig-panel/main/install.sh)
```

---

## ✨ امکانات

| امکان | وضعیت |
|-------|--------|
| داشبورد با نمودار ترافیک | ✅ |
| مدیریت کاربران (افزودن، حذف، تمدید) | ✅ |
| دریافت لینک کانفیگ | ✅ |
| مدیریت نودها و وضعیت سرورها | ✅ |
| مدیریت پلن‌های فروش | ✅ |
| طراحی ریسپانسیو موبایل | ✅ |
| پشتیبانی از VLESS, VMess, Trojan, Shadowsocks | ✅ |

---

## 📋 دستورات مدیریت سرویس

```bash
systemctl status migmig    # وضعیت
systemctl restart migmig   # ریستارت
systemctl stop migmig      # توقف
journalctl -u migmig -f    # لاگ‌ها
```

---

## 🛠 نصب دستی (توسعه‌دهندگان)

```bash
git clone https://github.com/YOUR_USERNAME/migmig-panel
cd migmig-panel
npm install
npm run dev      # حالت توسعه — پورت 3000
npm run build    # build برای production
npm run preview  # پیش‌نمایش build
```

---

## 📁 ساختار پروژه

```
migmig-panel/
├── src/
│   ├── App.jsx        # کامپوننت اصلی پنل
│   └── main.jsx       # entry point
├── public/
│   └── favicon.svg
├── install.sh         # اسکریپت نصب یک‌خطی
├── Dockerfile
├── docker-compose.yml
├── vite.config.js
└── package.json
```

---

<div align="center">
ساخته‌شده با ❤️ برای جامعه ایرانی
</div>
