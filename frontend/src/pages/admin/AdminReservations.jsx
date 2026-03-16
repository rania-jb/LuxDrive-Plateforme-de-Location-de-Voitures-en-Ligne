import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReservations, updateReservationStatus } from '../../Redux/actions';
import AdminSidebar from '../../components/AdminSidebar';
import { FiSearch, FiX, FiCalendar, FiArrowRight, FiCheck, FiSlash } from 'react-icons/fi';
import { RiCarLine } from 'react-icons/ri';
import { MdOutlinePending } from 'react-icons/md';
import './AdminReservations.css';

const AdminReservations = () => {
  const dispatch = useDispatch();
  const { allReservations, loading } = useSelector((s) => s.reservations);

  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [confirm, setConfirm] = useState(null); // res id + action

  useEffect(() => { dispatch(fetchAllReservations()); }, [dispatch]);

  const filtered = allReservations.filter((r) => {
    const matchSearch = `${r.user?.firstname} ${r.user?.lastname} ${r.user?.email} ${r.car?.brand} ${r.car?.model}`
      .toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter; 
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       allReservations.length,
    pending:   allReservations.filter(r => r.status === 'pending').length,
    confirmed: allReservations.filter(r => r.status === 'confirmed').length,
    cancelled: allReservations.filter(r => r.status === 'cancelled').length,
    completed: allReservations.filter(r => r.status === 'completed').length,
  };

  const handleStatus = async (id, status) => {
    await dispatch(updateReservationStatus(id, status));
    setConfirm(null);
  };

  const statusConfig = {
    pending:   { label: 'Pending',   color: '#d97706', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)'  },
    confirmed: { label: 'Confirmed', color: '#16a34a', bg: 'rgba(46,199,138,0.1)',  border: 'rgba(46,199,138,0.3)'   },
    cancelled: { label: 'Cancelled', color: '#dc2626', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)'    },
    completed: { label: 'Completed', color: '#73e546', bg: 'rgba(83, 229, 70, 0.08)', border: 'rgba(115, 229, 70, 0.2)' },

  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">

        {/* Header */}
        <div className="ar-header">
          <div>
            <h1>Reservations</h1>
            <p>{allReservations.length} total bookings</p>
          </div>
          {/* Stats pills */}
          <div className="ar-stats">
            <div className="ar-stat pending">
              <MdOutlinePending size={15} />
              <span>{counts.pending} Pending</span>
            </div>
            <div className="ar-stat confirmed">
              <FiCheck size={14} />
              <span>{counts.confirmed} Confirmed</span>
            </div>
            <div className="ar-stat cancelled">
              <FiSlash size={13} />
              <span>{counts.cancelled} Cancelled</span>
            </div>
            <div className="ar-stat completed">
              <FiCheck size={14} />
              <span>{counts.completed} Completed</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="ar-toolbar">
          <div className="ar-search">
            <FiSearch size={14} />
            <input
              placeholder="Search by user, email, car..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')}><FiX size={12} /></button>}
          </div>
          <div className="ar-tabs">
            {['all','pending','confirmed','cancelled','completed'].map((tab) => (
              <button
                key={tab}
                className={`ar-tab ${filter === tab ? 'active' : ''} ${tab}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ar-tab-count">{counts[tab]}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="ar-count">
          Showing <strong>{filtered.length}</strong> of {allReservations.length}
        </p>

        {/* List */}
        {loading ? (
          <div className="ar-list">
            {[1,2,3,4].map((i) => <div key={i} className="ar-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="ar-empty">
            <RiCarLine size={48} />
            <h3>No reservations found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="ar-list">
            {filtered.map((res) => {
              const sc = statusConfig[res.status] || statusConfig.pending;
              return (
                <div key={res._id} className="ar-card">

                  {/* Car image */}
                  <div className="ar-car-img">
                    <img src={res.car?.image || '/car-placeholder.png'} alt="" />
                  </div>

                  {/* Car + Dates */}
                  <div className="ar-col car-col">
                    <div className="ar-car-name">
                      <RiCarLine size={13} />
                      <strong>{res.car?.brand} {res.car?.model}</strong>
                    </div>
                    <div className="ar-dates">
                      <div className="ar-date">
                        <FiCalendar size={11} />
                        {new Date(res.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <FiArrowRight size={12} className="ar-arrow" />
                      <div className="ar-date">
                        <FiCalendar size={11} />
                        {new Date(res.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="ar-days">{res.days} day{res.days > 1 ? 's' : ''}</span>
                  </div>

                  {/* User */}
                  <div className="ar-col user-col">
                    <div className="ar-user-avatar">
                      {res.user?.firstname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="ar-user-name">{res.user?.firstname} {res.user?.lastname}</p>
                      <p className="ar-user-email">{res.user?.email}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="ar-col price-col">
                    <span className="ar-price">{res.totalPrice}</span>
                    <small>TND</small>
                  </div>

                  {/* Status */}
                  <div className="ar-col status-col">
                    <span
                      className="ar-status"
                      style={{ color: sc.color, background: sc.bg, border: `1.5px solid ${sc.border}` }}
                    >
                      {sc.label}
                    </span>
                    <span className="ar-booked-on">
                      {new Date(res.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="ar-col actions-col">
                    {res.status === 'pending' && (
                      <>
                        <button
                          className="ar-btn confirm"
                          onClick={() => setConfirm({ id: res._id, action: 'confirmed' })}
                        >
                          <FiCheck size={13} /> Confirm
                        </button>
                        <button
                          className="ar-btn cancel"
                          onClick={() => setConfirm({ id: res._id, action: 'cancelled' })}
                        >
                          <FiX size={13} /> Cancel
                        </button>
                      </>
                    )}
                    {res.status === 'confirmed' && (
                      <button
                        className="ar-btn cancel"
                        onClick={() => setConfirm({ id: res._id, action: 'cancelled' })}
                      >
                        <FiX size={13} /> Cancel
                      </button>
                    )}
                    {res.status === 'cancelled' && (
                      <button
                        className="ar-btn reopen"
                        onClick={() => setConfirm({ id: res._id, action: 'pending' })}
                      >
                        <MdOutlinePending size={13} /> Reopen
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Confirm Modal */}
      {confirm && (
        <div className="ar-modal-overlay" onClick={() => setConfirm(null)}>
          <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`ar-modal-icon ${confirm.action}`}>
              {confirm.action === 'confirmed' ? <FiCheck size={26} /> :
               confirm.action === 'cancelled' ? <FiX size={26} /> :
               <MdOutlinePending size={26} />}
            </div>
            <h3>
              {confirm.action === 'confirmed' ? 'Confirm Reservation?' :
               confirm.action === 'cancelled' ? 'Cancel Reservation?' :
               'Reopen Reservation?'}
            </h3>
            <p>
              {confirm.action === 'confirmed' ? 'This will notify the user their booking is confirmed.' :
               confirm.action === 'cancelled' ? 'This will cancel the reservation.' :
               'This will set the reservation back to pending.'}
            </p>
            <div className="ar-modal-btns">
              <button className="ar-modal-back" onClick={() => setConfirm(null)}>
                Go Back
              </button>
              <button
                className={`ar-modal-confirm ${confirm.action}`}
                onClick={() => handleStatus(confirm.id, confirm.action)}
              >
                Yes, {confirm.action === 'confirmed' ? 'Confirm' :
                      confirm.action === 'cancelled' ? 'Cancel' : 'Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReservations;