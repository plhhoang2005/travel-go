import { NavLink } from 'react-router-dom';

const links = [
  ['/trip/current', 'Tổng quan'],
  ['/destinations', 'Điểm đến'],
  ['/transport', 'Phương tiện'],
  ['/budget', 'Ngân sách'],
  ['/itinerary', 'Lịch trình'],
] as const;

export function TripResultNav() {
  return (
    <nav className="result-nav" aria-label="Các phần trong kế hoạch chuyến đi">
      <span>Hành trình của tôi</span>
      <div>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'is-active' : ''}>{label}</NavLink>
        ))}
      </div>
    </nav>
  );
}
