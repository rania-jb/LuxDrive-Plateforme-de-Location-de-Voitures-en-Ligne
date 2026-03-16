import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdAddCircleOutline, MdBookmarks} from 'react-icons/md';
import { RiCarLine } from 'react-icons/ri';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();  
  const { user } = useSelector((s) => s.auth);

  const links = [
    { to: '/admin/dashboard',    icon: <MdDashboard size={18} />,        label: 'Dashboard'       },
    { to: '/admin/cars/new',     icon: <MdAddCircleOutline size={18} />, label: 'Add Car'         },
    { to: '/admin/cars',         icon: <RiCarLine size={18} />,          label: 'Manage Cars'     },
    { to: '/admin/reservations', icon: <MdBookmarks size={18} />,        label: 'Manage Bookings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.avatar
            ? <img src={`${user.avatar}`} alt="avatar" />
            : user?.firstname?.charAt(0).toUpperCase()
          }
        </div>
        <span className="sidebar-name">{user?.firstname}</span>
        <span className="sidebar-role">Administrator</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;