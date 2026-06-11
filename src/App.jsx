import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2230", border: "#2D3A4E",
  cyan: "#00D4FF", cyanDim: "#00D4FF22", coral: "#FF6B6B",
  green: "#3DD68C", yellow: "#F0C040",
  text: "#E6EDF3", textMuted: "#8B949E", textDim: "#484F58",
};

const mockUsers = [
  { id: 1, name: "ali_vip", plan: "ماهانه ۵۰GB", used: 31.4, total: 50, days: 12, status: "active", ip: "10.0.0.2", proto: "VLESS" },
  { id: 2, name: "sara_basic", plan: "هفتگی ۲۰GB", used: 18.9, total: 20, days: 3, status: "warning", ip: "10.0.0.3", proto: "VMess" },
  { id: 3, name: "reza_test", plan: "روزانه ۵GB", used: 5.0, total: 5, days: 0, status: "expired", ip: "—", proto: "Trojan" },
  { id: 4, name: "mina_pro", plan: "ماهانه ۱۰۰GB", used: 22.1, total: 100, days: 25, status: "active", ip: "10.0.0.5", proto: "VLESS" },
  { id: 5, name: "kamran99", plan: "سه‌ماهه ۱۵۰GB", used: 67.3, total: 150, days: 61, status: "active", ip: "10.0.0.6", proto: "VMess" },
  { id: 6, name: "negar_x", plan: "هفتگی ۲۰GB", used: 4.2, total: 20, days: 6, status: "active", ip: "10.0.0.7", proto: "Shadowsocks" },
];
const mockNodes = [
  { id: 1, name: "DE-Frankfurt-01", flag: "🇩🇪", load: 42, users: 18, uptime: "99.8%", status: "online" },
  { id: 2, name: "NL-Amsterdam-01", flag: "🇳🇱", load: 67, users: 31, uptime: "99.5%", status: "online" },
  { id: 3, name: "FI-Helsinki-01", flag: "🇫🇮", load: 23, users: 9, uptime: "100%", status: "online" },
  { id: 4, name: "TR-Istanbul-01", flag: "🇹🇷", load: 88, users: 45, uptime: "98.1%", status: "warning" },
  { id: 5, name: "US-NewYork-01", flag: "🇺🇸", load: 0, users: 0, uptime: "—", status: "offline" },
];
const mockPlans = [
  { id: 1, name: "روزانه ۵GB", price: 8000, traffic: 5, days: 1, color: COLORS.textMuted },
  { id: 2, name: "هفتگی ۲۰GB", price: 25000, traffic: 20, days: 7, color: COLORS.cyan },
  { id: 3, name: "ماهانه ۵۰GB", price: 80000, traffic: 50, days: 30, color: COLORS.green },
  { id: 4, name: "ماهانه ۱۰۰GB", price: 140000, traffic: 100, days: 30, color: COLORS.yellow },
  { id: 5, name: "سه‌ماهه ۱۵۰GB", price: 320000, traffic: 150, days: 90, color: COLORS.coral },
];

const fmtGB = (n) => n >= 1 ? `${n.toFixed(1)} GB` : `${(n * 1024).toFixed(0)} MB`;
const fmtPrice = (n) => n.toLocaleString("fa-IR") + " تومان";
const statusColor = (s) => ({ active: COLORS.green, warning: COLORS.yellow, expired: COLORS.coral, online: COLORS.green, offline: COLORS.coral }[s] || COLORS.textMuted);
const statusLabel = (s) => ({ active: "فعال", warning: "رو به پایان", expired: "منقضی", online: "آنلاین", offline: "آفلاین" }[s] || s);

// ── useIsMobile hook ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function PulseRing({ color = COLORS.green }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10 }}>
      <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: color, opacity: 0.4, animation: "pulseRing 1.8s ease-out infinite" }} />
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "block" }} />
    </span>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function TrafficBar({ used, total }) {
  const pct = Math.min((used / total) * 100, 100);
  const col = pct > 90 ? COLORS.coral : pct > 70 ? COLORS.yellow : COLORS.cyan;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
        <span>{fmtGB(used)}</span><span>{fmtGB(total)}</span>
      </div>
      <div style={{ height: 5, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style: s = {} }) {
  const vs = {
    primary: { background: COLORS.cyan, color: "#0D1117", fontWeight: 700 },
    danger:  { background: COLORS.coral + "22", color: COLORS.coral, border: `1px solid ${COLORS.coral}44` },
    ghost:   { background: "none", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
    success: { background: COLORS.green + "22", color: COLORS.green, border: `1px solid ${COLORS.green}44` },
  };
  return (
    <button onClick={onClick}
      style={{ borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer", border: "none", transition: "opacity .15s", fontFamily: "inherit", ...vs[variant], ...s }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.75"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 6 }}>{label}</div>}
      <input {...props} style={{
        width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
        borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 15,
        outline: "none", boxSizing: "border-box", direction: "rtl", fontFamily: "inherit",
        ...(props.style || {})
      }} />
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 6 }}>{label}</div>}
      <select value={value} onChange={onChange} style={{
        width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
        borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 15,
        outline: "none", direction: "rtl", fontFamily: "inherit"
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}
      onClick={onClose}>
      <div style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto"
      }} onClick={e => e.stopPropagation()}>
        {/* drag handle */}
        <div style={{ width: 40, height: 4, background: COLORS.border, borderRadius: 4, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 16 }}>{title}</div>
          <button onClick={onClose} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, cursor: "pointer", fontSize: 18, width: 32, height: 32, borderRadius: 8, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function Dashboard() {
  const isMob = useIsMobile();
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === "active").length;
  const totalTraffic = mockUsers.reduce((a, u) => a + u.used, 0);
  const onlineNodes = mockNodes.filter(n => n.status === "online").length;
  const traffic7d = [12, 18, 15, 24, 20, 31, 27];
  const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const maxT = Math.max(...traffic7d);

  const stats = [
    { label: "کاربران فعال", value: activeUsers, sub: `از ${totalUsers} کل`, accent: COLORS.cyan },
    { label: "ترافیک مصرفی", value: fmtGB(totalTraffic), sub: "این ماه", accent: COLORS.green },
    { label: "نودهای آنلاین", value: `${onlineNodes}/${mockNodes.length}`, sub: "سرور فعال", accent: COLORS.yellow },
    { label: "درآمد ماه", value: "۴.۱M", sub: "تومان", accent: COLORS.coral },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: COLORS.text, fontSize: 19, fontWeight: 700 }}>داشبورد</div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>خوش اومدی به پنل میگ‌میگ 🦐</div>
      </div>

      {/* Stats grid — 2 col on mobile, 4 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.accent, fontSize: isMob ? 20 : 24, fontWeight: 700, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 16, fontSize: 13 }}>ترافیک ۷ روز اخیر (GB)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {traffic7d.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: COLORS.textMuted }}>{v}</div>
              <div style={{ width: "100%", height: `${(v / maxT) * 70}px`, background: `linear-gradient(180deg, ${COLORS.cyan}, ${COLORS.cyan}55)`, borderRadius: "4px 4px 0 0" }} />
              <div style={{ fontSize: 10, color: COLORS.textDim }}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent users */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 16px" }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 14, fontSize: 13 }}>آخرین کاربران</div>
        {mockUsers.slice(0, 4).map(u => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: COLORS.cyanDim, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.cyan, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {u.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{u.name}</div>
              <TrafficBar used={u.used} total={u.total} />
            </div>
            <Badge label={statusLabel(u.status)} color={statusColor(u.status)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showConfig, setShowConfig] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", plan: "3", proto: "VLESS" });
  const [copied, setCopied] = useState(false);

  const filtered = users.filter(u => u.name.includes(search));
  const addUser = () => {
    const plan = mockPlans.find(p => p.id === +newUser.plan);
    setUsers([...users, { id: Date.now(), name: newUser.name, plan: plan.name, used: 0, total: plan.traffic, days: plan.days, status: "active", ip: `10.0.0.${users.length + 2}`, proto: newUser.proto }]);
    setShowAdd(false);
    setNewUser({ name: "", plan: "3", proto: "VLESS" });
  };
  const getConfig = (u) => `vless://${u.id}uuid-${u.name}@de-frankfurt.migmig.net:443?type=ws&security=tls&path=%2Fmigmig&host=de-frankfurt.migmig.net#MigMig-${u.name}`;
  const copyConfig = (u) => {
    navigator.clipboard?.writeText(getConfig(u));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10 }}>
        <div style={{ color: COLORS.text, fontSize: 19, fontWeight: 700 }}>کاربران</div>
        <Btn onClick={() => setShowAdd(true)} style={{ padding: "8px 14px", fontSize: 13 }}>+ جدید</Btn>
      </div>

      <input placeholder="🔍  جستجو..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "11px 14px", color: COLORS.text, fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", direction: "rtl", fontFamily: "inherit" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(u => (
          <div key={u.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "15px 15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.cyanDim, color: COLORS.cyan, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {u.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                  <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 2 }}>
                    <span style={{ color: COLORS.textMuted }}>{u.proto}</span> · <span style={{ color: u.days <= 3 ? COLORS.coral : COLORS.textMuted }}>{u.days}روز</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <PulseRing color={statusColor(u.status)} />
                <Badge label={statusLabel(u.status)} color={statusColor(u.status)} />
              </div>
            </div>

            <TrafficBar used={u.used} total={u.total} />

            {/* Action row — full width, equal buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setShowConfig(u)} style={{ fontSize: 11, padding: "8px 4px", textAlign: "center" }}>📋 کانفیگ</Btn>
              <Btn variant="success" onClick={() => setUsers(users.map(x => x.id === u.id ? { ...x, status: "active", days: 30, used: 0 } : x))} style={{ fontSize: 11, padding: "8px 4px" }}>🔄 تمدید</Btn>
              <Btn variant="danger" onClick={() => setUsers(users.filter(x => x.id !== u.id))} style={{ fontSize: 11, padding: "8px 4px" }}>🗑 حذف</Btn>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="کاربر جدید" onClose={() => setShowAdd(false)}>
          <Input label="نام کاربری" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="مثلاً: ali_vip" />
          <Select label="پلن" value={newUser.plan} onChange={e => setNewUser({ ...newUser, plan: e.target.value })}
            options={mockPlans.map(p => ({ value: p.id, label: `${p.name} — ${fmtPrice(p.price)}` }))} />
          <Select label="پروتکل" value={newUser.proto} onChange={e => setNewUser({ ...newUser, proto: e.target.value })}
            options={["VLESS", "VMess", "Trojan", "Shadowsocks"].map(p => ({ value: p, label: p }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>انصراف</Btn>
            <Btn onClick={addUser} style={{ opacity: newUser.name ? 1 : 0.5 }}>ایجاد کاربر</Btn>
          </div>
        </Modal>
      )}

      {showConfig && (
        <Modal title={`کانفیگ ${showConfig.name}`} onClose={() => setShowConfig(null)}>
          <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ width: 140, height: 140, margin: "0 auto 14px", background: COLORS.card, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textDim, fontSize: 11, border: `2px dashed ${COLORS.border}` }}>QR Code</div>
            <div style={{ color: COLORS.cyan, fontSize: 11, wordBreak: "break-all", fontFamily: "monospace", background: COLORS.card, borderRadius: 8, padding: 12, direction: "ltr", lineHeight: 1.6 }}>
              {getConfig(showConfig)}
            </div>
          </div>
          <Btn onClick={() => copyConfig(showConfig)} style={{ width: "100%", textAlign: "center", padding: 12 }}>
            {copied ? "✅ کپی شد!" : "📋 کپی لینک"}
          </Btn>
        </Modal>
      )}
    </div>
  );
}

function NodesPage() {
  return (
    <div>
      <div style={{ color: COLORS.text, fontSize: 19, fontWeight: 700, marginBottom: 16 }}>نودها</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockNodes.map(n => {
          const loadColor = n.load > 80 ? COLORS.coral : n.load > 60 ? COLORS.yellow : COLORS.green;
          return (
            <div key={n.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "15px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: n.status !== "offline" ? 12 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 26 }}>{n.flag}</span>
                  <div>
                    <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 13 }}>{n.name}</div>
                    <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 2 }}>آپتایم {n.uptime} · {n.users} کاربر</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <PulseRing color={statusColor(n.status)} />
                  <Badge label={n.status === "warning" ? "پرفشار" : statusLabel(n.status)} color={statusColor(n.status)} />
                </div>
              </div>
              {n.status !== "offline" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>
                    <span>بار سرور</span><span style={{ color: loadColor }}>{n.load}%</span>
                  </div>
                  <div style={{ height: 6, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${n.load}%`, height: "100%", background: loadColor, borderRadius: 4 }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [showAdd, setShowAdd] = useState(false);
  const [np, setNp] = useState({ name: "", price: "", traffic: "", days: "" });
  const addPlan = () => {
    setPlans([...plans, { id: Date.now(), name: np.name, price: +np.price, traffic: +np.traffic, days: +np.days, color: COLORS.cyan }]);
    setShowAdd(false); setNp({ name: "", price: "", traffic: "", days: "" });
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: COLORS.text, fontSize: 19, fontWeight: 700 }}>پلن‌ها</div>
        <Btn onClick={() => setShowAdd(true)} style={{ padding: "8px 14px", fontSize: 13 }}>+ جدید</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {plans.map(p => (
          <div key={p.id} style={{ background: COLORS.card, border: `1px solid ${p.color}44`, borderRadius: 14, padding: "16px 14px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
            <div style={{ color: p.color, fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{p.traffic}GB</div>
            <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 10, fontSize: 12, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 2 }}>⏱ {p.days} روز</div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 12 }}>{p.price.toLocaleString("fa-IR")} <span style={{ color: COLORS.textDim, fontWeight: 400 }}>ت</span></div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <Btn variant="ghost" style={{ flex: 1, fontSize: 10, padding: "6px 4px" }}>ویرایش</Btn>
              <Btn variant="danger" onClick={() => setPlans(plans.filter(x => x.id !== p.id))} style={{ fontSize: 10, padding: "6px 8px" }}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <Modal title="پلن جدید" onClose={() => setShowAdd(false)}>
          <Input label="نام پلن" value={np.name} onChange={e => setNp({ ...np, name: e.target.value })} placeholder="مثلاً: ماهانه ۵۰GB" />
          <Input label="ترافیک (GB)" type="number" value={np.traffic} onChange={e => setNp({ ...np, traffic: e.target.value })} />
          <Input label="مدت (روز)" type="number" value={np.days} onChange={e => setNp({ ...np, days: e.target.value })} />
          <Input label="قیمت (تومان)" type="number" value={np.price} onChange={e => setNp({ ...np, price: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>انصراف</Btn>
            <Btn onClick={addPlan}>ذخیره</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SettingsPage() {
  const [domain, setDomain] = useState("migmig.net");
  const [port, setPort] = useState("443");
  const [botToken, setBotToken] = useState("7123456789:AAF...");
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <div style={{ color: COLORS.text, fontSize: 19, fontWeight: 700, marginBottom: 16 }}>تنظیمات</div>
      {[
        { title: "🖥 سرور", fields: [{ label: "دامنه", value: domain, set: setDomain }, { label: "پورت", value: port, set: setPort }] },
        { title: "🤖 ربات تلگرام", fields: [{ label: "توکن ربات", value: botToken, set: setBotToken }] },
      ].map(s => (
        <div key={s.title} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
          <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 14, fontSize: 13 }}>{s.title}</div>
          {s.fields.map(f => <Input key={f.label} label={f.label} value={f.value} onChange={e => f.set(e.target.value)} />)}
        </div>
      ))}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 14, fontSize: 13 }}>🔐 رمز عبور</div>
        <Input label="رمز فعلی" type="password" placeholder="••••••••" />
        <Input label="رمز جدید" type="password" placeholder="••••••••" />
      </div>
      <Btn onClick={save} style={{ width: "100%", textAlign: "center", padding: 13, fontSize: 14 }}>
        {saved ? "✅ ذخیره شد!" : "💾 ذخیره تغییرات"}
      </Btn>
    </div>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "داشبورد", icon: "📊" },
  { id: "users",     label: "کاربران",  icon: "👥" },
  { id: "nodes",     label: "نودها",    icon: "🌐" },
  { id: "plans",     label: "پلن‌ها",   icon: "💳" },
  { id: "settings",  label: "تنظیمات",  icon: "⚙️" },
];

const PAGES = { dashboard: Dashboard, users: UsersPage, nodes: NodesPage, plans: PlansPage, settings: SettingsPage };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const isMob = useIsMobile();
  const Page = PAGES[page];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, sans-serif", direction: "rtl", color: COLORS.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        @keyframes pulseRing { 0% { transform: scale(1); opacity:.5; } 100% { transform: scale(2.4); opacity:0; } }
        input::placeholder { color: ${COLORS.textDim}; }
        input:focus, select:focus { border-color: ${COLORS.cyan}66 !important; box-shadow: 0 0 0 3px ${COLORS.cyan}11; }
        select option { background: ${COLORS.card}; }
        @media (max-width: 767px) {
          .sidebar { transform: translateX(100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-right: 0 !important; padding-bottom: 80px !important; }
          .topbar { right: 0 !important; }
        }
        @media (min-width: 768px) {
          .bottom-nav { display: none !important; }
          .hamburger { display: none !important; }
          .sidebar { transform: translateX(0) !important; }
          .main-content { margin-right: 220px !important; }
          .topbar { right: 220px !important; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <div className={`sidebar${sideOpen ? " open" : ""}`} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 220,
        background: COLORS.surface, borderLeft: `1px solid ${COLORS.border}`,
        zIndex: 500, display: "flex", flexDirection: "column", transition: "transform .25s"
      }}>
        <div style={{ padding: "22px 18px 18px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.cyan}, #0080FF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🦐</div>
            <div>
              <div style={{ color: COLORS.text, fontWeight: 800, fontSize: 17, letterSpacing: -0.5 }}>میگ‌میگ</div>
              <div style={{ color: COLORS.cyan, fontSize: 9, fontWeight: 600, letterSpacing: 1 }}>MIG MIG PANEL</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => { setPage(n.id); setSideOpen(false); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? COLORS.cyanDim : "none",
                color: active ? COLORS.cyan : COLORS.textMuted,
                fontWeight: active ? 700 : 400, fontSize: 14,
                borderRight: `3px solid ${active ? COLORS.cyan : "transparent"}`,
                marginBottom: 2, textAlign: "right", transition: "all .15s", fontFamily: "inherit"
              }}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PulseRing color={COLORS.green} />
            <span style={{ color: COLORS.textMuted, fontSize: 11 }}>سیستم آنلاین</span>
          </div>
          <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 4 }}>v2.1.0 · MigMig Panel</div>
        </div>
      </div>

      {/* overlay for mobile sidebar */}
      {sideOpen && isMob && (
        <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "#000000AA", zIndex: 499 }} />
      )}

      {/* ── Top bar ── */}
      <div className="topbar" style={{
        position: "fixed", top: 0, left: 0,
        height: 52, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", padding: "0 16px", zIndex: 400, gap: 12
      }}>
        <button className="hamburger" onClick={() => setSideOpen(!sideOpen)} style={{
          background: COLORS.card, border: `1px solid ${COLORS.border}`,
          borderRadius: 8, color: COLORS.text, width: 36, height: 36, cursor: "pointer",
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
        }}>☰</button>
        <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>
          {NAV.find(n => n.id === page)?.icon} {NAV.find(n => n.id === page)?.label}
        </div>
        <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <PulseRing color={COLORS.green} />
          <span style={{ color: COLORS.textMuted, fontSize: 11 }}>آنلاین</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="main-content" style={{ paddingTop: 52 }}>
        <div style={{ padding: isMob ? "20px 14px" : "28px 28px", maxWidth: 900, margin: "0 auto" }}>
          <Page />
        </div>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <div className="bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: 68, background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-around",
        zIndex: 400, paddingBottom: "env(safe-area-inset-bottom)"
      }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer",
              color: active ? COLORS.cyan : COLORS.textDim,
              padding: "8px 12px", borderRadius: 10,
              transition: "color .15s", fontFamily: "inherit",
              position: "relative"
            }}>
              {active && (
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 28, height: 3, background: COLORS.cyan, borderRadius: "0 0 4px 4px"
                }} />
              )}
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
