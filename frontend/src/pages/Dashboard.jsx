import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, TrendingUp, BarChart2, Plus, LogOut, Search, Filter, 
  Edit2, Trash2, X, Eye, Phone, Building, Mail, FileText, CheckCircle, 
  RefreshCw, Check, Calendar, ArrowRight, UserPlus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard'); // 'Dashboard' or 'Customers'
  
  // Dashboard Data State
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0
  });
  const [timeline, setTimeline] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Customer List State
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    value: 0,
    notes: ''
  });
  const [formError, setFormError] = useState('');

  // Fetch Dashboard Stats & Customer List
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Stats
      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data.summary);
        setTimeline(statsData.data.timeline);
        setRecentActivities(statsData.data.recentActivities);
      }

      // Fetch Customers
      let customerUrl = `/api/customers?search=${searchTerm}&status=${statusFilter}`;
      const customerRes = await fetch(customerUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customerData = await customerRes.json();
      if (customerData.success) {
        setCustomers(customerData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, statusFilter, token]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      value: 0,
      notes: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company,
      status: customer.status,
      value: customer.value || 0,
      notes: customer.notes || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (customer) => {
    setModalMode('view');
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email || !formData.company) {
      setFormError('Name, Email, and Company are required.');
      return;
    }

    try {
      let url = '/api/customers';
      let method = 'POST';

      if (modalMode === 'edit') {
        url = `/api/customers/${selectedCustomer._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        setFormError(data.error || 'Operation failed');
      }
    } catch (error) {
      setFormError('Server connection error.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (error) {
      alert('Server connection error.');
    }
  };

  const handleStatusChangeQuick = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/customers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Quick status update failed');
      }
    } catch (error) {
      alert('Server connection error.');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon logo-icon-white">C</div>
          <span className="logo-text text-white">CRM<span>System</span></span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('Dashboard'); setStatusFilter('All'); }}
          >
            <BarChart2 size={18} /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'Customers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('Customers'); }}
          >
            <Users size={18} /> Customers
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="db-refresh-status">
            <RefreshCw size={12} className="spin-slow" />
            <span>Database Connected</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="workspace-container">
        {/* 2. Top Greeting Header */}
        <header className="workspace-header">
          <div className="header-greeting">
            <h1>Good morning, {user?.name || 'User'} ☀️</h1>
            <p>Here's how your sales pipeline is looking today.</p>
          </div>

          <div className="header-actions-dashboard">
            <div className="header-search-bar">
              <Search size={18} className="search-icon-header" />
              <input 
                type="text" 
                placeholder="Search name, email, company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Customer
            </button>
          </div>
        </header>

        {/* 3. Dashboard Metrics Row */}
        <section className="stats-row animate-fade">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Customers</span>
              <div className="stat-icon-wrapper blue-bg"><Users size={18} /></div>
            </div>
            <h2 className="stat-number">{stats.totalCustomers}</h2>
            <div className="stat-trend trend-up">
              <span>📈 +12%</span> this month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">New Leads</span>
              <div className="stat-icon-wrapper sky-bg"><Plus size={18} /></div>
            </div>
            <h2 className="stat-number">{stats.newLeads}</h2>
            <div className="stat-trend trend-neutral">
              <span>🆕 New</span> pipeline starts
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Contacted Leads</span>
              <div className="stat-icon-wrapper orange-bg"><Phone size={18} /></div>
            </div>
            <h2 className="stat-number">{stats.contactedLeads}</h2>
            <div className="stat-trend trend-active">
              <span>📞 In discussion</span> with reps
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Converted Leads</span>
              <div className="stat-icon-wrapper green-bg"><CheckCircle size={18} /></div>
            </div>
            <h2 className="stat-number">{stats.convertedLeads}</h2>
            <div className="stat-trend trend-success">
              <span>🎉 Deals closed</span> successfully
            </div>
          </div>
        </section>

        {/* 4. Bottom Main Layout Grid */}
        <div className="workspace-grid animate-fade">
          {/* Main workspace (Table or Chart + Table depending on Tab) */}
          <div className="main-content-panel">
            {activeTab === 'Dashboard' && timeline.length > 0 && (
              <div className="card chart-card mb-6">
                <div className="card-header-flex">
                  <div>
                    <h3>Pipeline Trends</h3>
                    <p className="card-subtitle">Monthly overview of customer acquisitions and lead updates.</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00a859" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00a859" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Area type="monotone" dataKey="total" name="Total customers" stroke="#00a859" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Customer List Container */}
            <div className="card customer-list-card">
              <div className="customer-list-header">
                <div>
                  <h3>Customer List</h3>
                  <p className="card-subtitle">Manage, search, and update your leads.</p>
                </div>
                
                {/* Search / Filter Buttons */}
                <div className="filter-controls">
                  <div className="filter-tabs">
                    {['All', 'New', 'Contacted', 'Converted'].map((tab) => (
                      <button
                        key={tab}
                        className={`filter-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                        onClick={() => setStatusFilter(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="table-loader-row">
                  <div className="spinner-green"></div>
                  <span>Loading customer records...</span>
                </div>
              ) : customers.length === 0 ? (
                <div className="empty-state-table">
                  <UserPlus size={40} className="empty-state-icon" />
                  <h4>No customers found</h4>
                  <p>Try refining your search or add a new customer to start your pipeline.</p>
                  <button onClick={handleOpenAddModal} className="btn btn-primary mt-2">
                    Add Customer
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="customer-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Company</th>
                        <th>Lead Status</th>
                        <th>Value</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer._id} className="table-row-hover">
                          <td>
                            <div className="customer-profile-cell" onClick={() => handleOpenViewModal(customer)}>
                              <div className="avatar-circle">
                                {getInitials(customer.name)}
                              </div>
                              <div>
                                <div className="customer-name-table">{customer.name}</div>
                                <div className="customer-email-table">{customer.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="customer-company-table">{customer.company}</span>
                          </td>
                          <td>
                            <div className="status-dropdown-wrapper">
                              <select 
                                value={customer.status} 
                                onChange={(e) => handleStatusChangeQuick(customer._id, e.target.value)}
                                className={`status-dropdown-select badge badge-${customer.status.toLowerCase()}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <span className="customer-value-table">{formatCurrency(customer.value)}</span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                onClick={() => handleOpenViewModal(customer)} 
                                className="action-btn text-blue"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleOpenEditModal(customer)} 
                                className="action-btn text-green"
                                title="Edit Customer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCustomer(customer._id)} 
                                className="action-btn text-red"
                                title="Delete Customer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: Recent Activities / Logs */}
          <div className="recent-activity-sidebar">
            <div className="card activity-card">
              <h3>Lead Status Updates</h3>
              <p className="card-subtitle">Recent pipeline activities log.</p>

              {recentActivities.length === 0 ? (
                <div className="empty-activity">
                  <Calendar size={20} />
                  <span>No recent activity.</span>
                </div>
              ) : (
                <div className="activity-timeline">
                  {recentActivities.map((act) => (
                    <div key={act._id} className="activity-item">
                      <div className="activity-line"></div>
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p className="activity-text">
                          <strong>{act.name}</strong> status changed to <span className={`badge badge-${act.status.toLowerCase()}`}>{act.status}</span>
                        </p>
                        <span className="activity-time">
                          {act.company} • {new Date(act.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 5. Add / Edit / View Modals */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' && 'Add New Customer'}
                {modalMode === 'edit' && 'Edit Customer Details'}
                {modalMode === 'view' && 'Customer Summary Card'}
              </h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="auth-alert mb-4">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {modalMode === 'view' && selectedCustomer ? (
              <div className="customer-detail-view">
                <div className="detail-header-card">
                  <div className="detail-avatar">
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h3>{selectedCustomer.name}</h3>
                    <p className="detail-company">{selectedCustomer.company}</p>
                    <span className={`badge badge-${selectedCustomer.status.toLowerCase()} mt-1`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                <div className="detail-info-list">
                  <div className="detail-item">
                    <Mail size={16} />
                    <div>
                      <span className="detail-label-text">Email</span>
                      <p className="detail-value-text">{selectedCustomer.email}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Phone size={16} />
                    <div>
                      <span className="detail-label-text">Phone Number</span>
                      <p className="detail-value-text">{selectedCustomer.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <TrendingUp size={16} />
                    <div>
                      <span className="detail-label-text">Deal Value</span>
                      <p className="detail-value-text font-bold text-green-main">
                        {formatCurrency(selectedCustomer.value)}
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FileText size={16} />
                    <div>
                      <span className="detail-label-text">Notes / Details</span>
                      <p className="detail-value-text detail-notes">
                        {selectedCustomer.notes || 'No notes added yet.'}
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Calendar size={16} />
                    <div>
                      <span className="detail-label-text">Added On</span>
                      <p className="detail-value-text">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    onClick={() => handleOpenEditModal(selectedCustomer)} 
                    className="btn btn-primary"
                  >
                    <Edit2 size={14} /> Edit Customer
                  </button>
                  <button 
                    onClick={() => { setIsModalOpen(false); handleDeleteCustomer(selectedCustomer._id); }} 
                    className="btn btn-danger"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              // Add / Edit Form
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="cust-name">Full Name *</label>
                  <input
                    type="text"
                    id="cust-name"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-email">Email Address *</label>
                    <input
                      type="email"
                      id="cust-email"
                      className="form-control"
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-phone">Phone Number</label>
                    <input
                      type="text"
                      id="cust-phone"
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-company">Company *</label>
                    <input
                      type="text"
                      id="cust-company"
                      className="form-control"
                      placeholder="e.g. Acme Inc"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cust-value">Est. Deal Value ($)</label>
                    <input
                      type="number"
                      id="cust-value"
                      className="form-control"
                      placeholder="5000"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cust-status">Lead Stage</label>
                  <select
                    id="cust-status"
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cust-notes">Notes / Requirements</label>
                  <textarea
                    id="cust-notes"
                    rows="3"
                    className="form-control"
                    placeholder="Enter any customer notes or follow-up details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'add' ? 'Add Customer' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Custom Styles */}
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }

        /* 1. Sidebar Styles */
        .dashboard-sidebar {
          width: var(--sidebar-width);
          background-color: var(--brand-dark);
          color: white;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.35rem;
          margin-bottom: 3rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 500;
          font-size: 0.95rem;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover, .nav-item.active {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }
        .nav-item.active {
          background-color: var(--brand-primary);
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .db-refresh-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .spin-slow {
          animation: spin 6s linear infinite;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          text-align: left;
        }

        .logout-btn:hover {
          color: #fee2e2;
        }

        /* 2. Workspace container */
        .workspace-container {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 2.5rem;
          overflow-y: auto;
          max-width: calc(100vw - var(--sidebar-width));
        }

        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .header-greeting h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .header-greeting p {
          color: var(--text-muted);
          font-size: 0.925rem;
        }

        .header-actions-dashboard {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          width: 320px;
          box-shadow: var(--shadow-sm);
        }

        .search-icon-header {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .header-search-bar input {
          border: none;
          background: none;
          width: 100%;
          font-size: 0.875rem;
          color: var(--text-dark);
        }

        /* 3. Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stat-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blue-bg { background-color: #eff6ff; color: #2563eb; }
        .sky-bg { background-color: #f0f9ff; color: #0284c7; }
        .orange-bg { background-color: #fff7ed; color: #ea580c; }
        .green-bg { background-color: #f0fdf4; color: #16a34a; }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .stat-trend {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .stat-trend span {
          font-weight: 600;
        }
        .trend-up span { color: #16a34a; }
        .trend-neutral span { color: #0284c7; }
        .trend-active span { color: #ea580c; }
        .trend-success span { color: #16a34a; }

        /* 4. Grid Layout */
        .workspace-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 1150px) {
          .workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        .main-content-panel {
          display: flex;
          flex-direction: column;
        }

        .chart-card {
          padding: 1.5rem;
        }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .card-subtitle {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        /* Customer List Table Layout */
        .customer-list-card {
          padding: 1.5rem;
        }

        .customer-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 8px;
        }

        .filter-tab-btn {
          padding: 0.375rem 0.875rem;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-medium);
          border-radius: 6px;
        }

        .filter-tab-btn.active {
          background: white;
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        /* Table Design */
        .table-responsive {
          overflow-x: auto;
        }

        .customer-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .customer-table th {
          padding: 0.75rem 1rem;
          border-bottom: 2px solid var(--border-color);
          color: var(--text-medium);
          font-weight: 600;
          background-color: #fafbfb;
        }

        .customer-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .table-row-hover:hover {
          background-color: #fafbfc;
        }

        .customer-profile-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--brand-light);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.825rem;
          border: 1px solid rgba(0, 168, 89, 0.15);
        }

        .customer-name-table {
          font-weight: 600;
          color: var(--text-dark);
        }

        .customer-name-table:hover {
          color: var(--brand-primary);
          text-decoration: underline;
        }

        .customer-email-table {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .customer-company-table {
          font-weight: 500;
          color: var(--text-medium);
        }

        .status-dropdown-wrapper {
          display: inline-block;
        }

        .status-dropdown-select {
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }

        .status-dropdown-select:focus {
          box-shadow: none;
        }

        .customer-value-table {
          font-weight: 600;
          color: var(--text-dark);
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.375rem;
          border-radius: 6px;
          color: var(--text-muted);
        }

        .action-btn:hover {
          background: #f1f5f9;
        }
        .action-btn.text-blue:hover { color: #2563eb; }
        .action-btn.text-green:hover { color: #16a34a; }
        .action-btn.text-red:hover { color: #dc2626; }

        .table-loader-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 4rem 1rem;
          color: var(--text-medium);
        }

        .spinner-green {
          width: 32px;
          height: 32px;
          border: 3px solid var(--brand-light);
          border-radius: 50%;
          border-top-color: var(--brand-primary);
          animation: spin 0.8s linear infinite;
        }

        .empty-state-table {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state-table h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .empty-state-table p {
          color: var(--text-muted);
          font-size: 0.875rem;
          max-width: 320px;
          margin-bottom: 1rem;
        }

        .mt-2 { margin-top: 0.5rem; }

        /* Right Activity Sidebar */
        .recent-activity-sidebar {
          display: flex;
          flex-direction: column;
        }

        .activity-card {
          padding: 1.5rem;
        }

        .empty-activity {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2.5rem 1rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .activity-timeline {
          margin-top: 1.5rem;
          position: relative;
          padding-left: 1.25rem;
        }

        .activity-item {
          position: relative;
          padding-bottom: 1.5rem;
        }

        .activity-item:last-child {
          padding-bottom: 0;
        }

        .activity-line {
          position: absolute;
          left: -11px;
          top: 8px;
          bottom: 0;
          width: 2px;
          background-color: var(--border-color);
        }

        .activity-item:last-child .activity-line {
          display: none;
        }

        .activity-dot {
          position: absolute;
          left: -15px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--brand-primary);
          border: 2px solid white;
          box-shadow: 0 0 0 2px var(--brand-light);
        }

        .activity-content {
          font-size: 0.825rem;
        }

        .activity-text {
          color: var(--text-dark);
          line-height: 1.4;
        }

        .activity-time {
          display: block;
          font-size: 0.725rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* Detail Modal Styling */
        .customer-detail-view {
          padding: 0.5rem 0;
        }

        .detail-header-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .detail-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background-color: var(--brand-light);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          border: 1px solid rgba(0, 168, 89, 0.15);
        }

        .detail-company {
          color: var(--text-medium);
          font-size: 0.875rem;
        }

        .detail-info-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          color: var(--text-medium);
        }

        .detail-item svg {
          margin-top: 0.15rem;
          color: var(--text-muted);
        }

        .detail-label-text {
          display: block;
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value-text {
          font-size: 0.9rem;
          color: var(--text-dark);
          font-weight: 500;
        }

        .detail-notes {
          white-space: pre-wrap;
          font-style: italic;
          background-color: var(--bg-primary);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          margin-top: 0.25rem;
        }

        .text-green-main {
          color: var(--brand-primary) !important;
        }

        .font-bold {
          font-weight: 700;
        }

        /* Form styling */
        .form-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 500px) {
          .form-row-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            display: none; /* Collapsed on mobile, or toggle button needs to be added. Keeping it simple for demo */
          }
          .workspace-container {
            margin-left: 0;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
