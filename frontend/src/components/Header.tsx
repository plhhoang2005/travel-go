import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  ['/', 'Trang chủ'], ['/destinations', 'Khám phá'], ['/planner', 'Lập kế hoạch'],
  ['/itinerary', 'Chuyến đi của tôi'], ['/about', 'Về TravelGO'],
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Đến nội dung chính</a>
      <div className="page-shell flex h-[72px] items-center justify-between gap-6">
        <Link to="/" aria-label="TravelGO — Trang chủ" className="brand-wordmark">Travel<span>GO</span><i aria-hidden="true" /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `header-link ${isActive ? 'is-active' : ''}`}>{label}</NavLink>
          ))}
        </nav>
        <Link to="/planner" className="button-primary hidden px-4 py-2.5 text-sm lg:inline-flex">Tạo chuyến đi</Link>
        <button ref={toggleRef} type="button" className="menu-toggle lg:hidden" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-line bg-white px-4 py-3 lg:hidden" aria-label="Điều hướng trên điện thoại">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `header-link block ${isActive ? 'is-active' : ''}`}>{label}</NavLink>
          ))}
          <Link to="/planner" onClick={() => setMenuOpen(false)} className="button-primary mt-3 flex justify-center px-4 py-3 text-sm">Tạo chuyến đi</Link>
        </nav>
      )}
    </header>
  );
}
