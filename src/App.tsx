import { useEffect, useRef, useState } from "react";
import { BarChart3, CalendarDays, Clock3, History as HistoryIcon, LayoutDashboard, Menu, Settings as SettingsIcon, Plus, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import type { AppData } from "./types";
import { emptyData, loadData, saveData, localDate } from "./lib/storage";
import Dashboard from "./pages/Dashboard";
import DailyLog from "./pages/DailyLog";
import Planning from "./pages/Planning";
import HistoryPage from "./pages/History";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

type Page = "dashboard" | "daily" | "planning" | "history" | "progress" | "settings";
const nav: [Page, string, typeof LayoutDashboard][] = [
  ["dashboard", "Dashboard", LayoutDashboard], ["daily", "Daily Log", Clock3],
  ["planning", "Planning", CalendarDays], ["history", "History", HistoryIcon],
  ["progress", "Progress", BarChart3], ["settings", "Settings", SettingsIcon]
];
export default function App() {
  const [data, setData] = useState<AppData>(emptyData);
  const [page, setPage] = useState<Page>("dashboard");
  const [ready, setReady] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(() => { try { return window.localStorage.getItem("hsc-sidebar-collapsed") === "true"; } catch { return false; } });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mobileMenuWasOpen = useRef(false);

  useEffect(() => {
    loadData().then(d => { setData(d); document.documentElement.dataset.theme = d.settings.theme; })
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem("hsc-sidebar-collapsed", String(collapsed)); } catch { /* Navigation remains usable without saved preference. */ }
  }, [collapsed]);
  useEffect(() => {
    if (!ready) return;
    saveData(data);
    document.documentElement.dataset.theme = data.settings.theme;
  }, [data, ready]);
  useEffect(() => {
    if (!ready) return;
    const check = () => {
      const now = new Date(), date = localDate();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      for (const p of data.plans) {
        if (!p.reminder.enabled || p.date !== date || !p.reminder.time) continue;
        const [h, m] = p.reminder.time.split(":").map(Number);
        const target = h * 60 + m, current = now.getHours() * 60 + now.getMinutes();
        const due = p.reminder.repeat === "hourly" ? current >= target && (current - target) % 60 === 0 : current === target;
        if (!due) continue;
        const key = `hsc-rem-${p.id}-${date}-${hhmm}`;
        if (sessionStorage.getItem(key)) continue;
        sessionStorage.setItem(key, "1");
        if ("Notification" in window && Notification.permission === "granted")
          new Notification("Study Progress", { body: `Time to work on ${p.topic || "your planned target"}. Keep today's commitment moving.` });
      }
    };
    check();
    const id = window.setInterval(check, 30000);
    return () => clearInterval(id);
  }, [data.plans, ready]);

  useEffect(() => {
    if (!mobileMenu) { if (mobileMenuWasOpen.current) menuButtonRef.current?.focus(); mobileMenuWasOpen.current = false; return; }
    mobileMenuWasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector<HTMLButtonElement>("nav button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileMenu(false); return; }
      if (event.key === "Tab" && sidebarRef.current) {
        const selector = "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
        const items = Array.from(sidebarRef.current.querySelectorAll<HTMLElement>(selector));
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [mobileMenu]);

  if (!ready) return <div className="boot"><div className="logo">ST</div><b>Loading…</b></div>;
  const go = (next: Page) => { setPage(next); setMobileMenu(false); };
  const currentLabel = nav.find(item => item[0] === page)?.[1] ?? "Dashboard";
  return (
    <div className={"app" + (collapsed ? " sidebar-collapsed" : "")}>
      {mobileMenu && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      <aside id="main-navigation" ref={sidebarRef} className={"sidebar" + (mobileMenu ? " open" : "")} aria-label="Main navigation" aria-modal={mobileMenu || undefined} role={mobileMenu ? "dialog" : undefined}>
        <div className="brand">
          <div className="logo">ST</div>
          <div className="brand-copy"><strong>HSC Study Tracker</strong><small>Study smarter, one session at a time.</small></div>
          <button className="sidebar-close icon-btn" onClick={() => setMobileMenu(false)} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button className={page === id ? "active" : ""} key={id} onClick={() => go(id)}
              aria-current={page === id ? "page" : undefined} title={collapsed ? label : undefined}>
              <Icon size={19} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot"><b>8 subjects</b><small>Physics, Chemistry, Biology & Higher Mathematics.</small></div>
      </aside>
      <div className="main">
        <header>
          <div className="header-left">
            <button ref={menuButtonRef} className="icon-btn mobile-menu" onClick={() => setMobileMenu(v => !v)} aria-label={mobileMenu ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenu} aria-controls="main-navigation">
              <Menu />
            </button>
            <div><span className="eyebrow">HSC STUDY TRACKER</span><h1>{currentLabel}</h1></div>
          </div>
          <div className="header-actions">
            <button className="icon-btn desktop-sidebar-toggle" onClick={() => setCollapsed(v => !v)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} title={collapsed ? "Expand navigation" : "Collapse navigation"}>
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <button className="primary quick" onClick={() => go("daily")}><Plus size={18} /><span>Log study</span></button>
          </div>
        </header>
        <main>
          {page === "dashboard" && <Dashboard data={data} go={go} />}
          {page === "daily" && <DailyLog data={data} setData={setData} />}
          {page === "planning" && <Planning data={data} setData={setData} />}
          {page === "history" && <HistoryPage data={data} />}
          {page === "progress" && <Progress data={data} />}
          {page === "settings" && <Settings data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}
