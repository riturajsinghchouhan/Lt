import './Nav.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Auth from '../../AuthComponets/Auth';

function Nav() {
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole?.toLowerCase());
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <>
      <Auth />
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">

                {/* Logo */}
                {role !== 'admin' && (
                  <Link to="/" className="logo">
                    <img src="assets/images/L (2).png" alt="logo" />
                  </Link>
                )}

                <ul className="nav" style={{ display: menuOpen ? 'block' : '' }}>
                  {role === 'admin' ? (
                    <>
                      <li><Link to="/admin">Admin Home</Link></li>
                       
                       
                      {/* Master Data Dropdown */}
                      <li
                        className={`dropdown ${openDropdown === 'master' ? 'open' : ''}`}
                        onClick={() => toggleDropdown('master')}
                      >
                        <span>Master Data ▼</span>
                        <ul className="dropdown-menu">
                          <li><Link to="/add-category">Add Category</Link></li>
                          <li><Link to="/add-subcategory">Add Subcategory</Link></li>
                          <li><Link to="/admin/manage-ads">Manage ADS</Link></li>
                          
                        </ul>
                      </li>

                      {/* Orders & Ads Dropdown */}
                      <li
                        className={`dropdown ${openDropdown === 'orders' ? 'open' : ''}`}
                        onClick={() => toggleDropdown('orders')}
                      >
                        <span>Orders & User ▼</span>
                        <ul className="dropdown-menu">
                          <li><Link to="/manage-oders">Manage Orders</Link></li>
                          <li><Link to="/all_custom_oders">Custom Cake Orders</Link></li>
                          <li><Link to="/admin/contacts">Manage Contacts</Link></li>
                          <li><Link to="/manage-users">Manage Users</Link></li>

                         
                        </ul>
                      </li>

                      <li>
                        <button
                          onClick={handleLogout}
                          className="btn btn-link nav-link"
                          style={{ padding: 7.5 }}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About Us</Link></li>
                      <li><Link to="/contact">Contact Us</Link></li>

                      {role === 'user' && (
                        <>
                          <li><Link to="/orders">My Orders</Link></li>
                          <li><Link to="/customcake">Customize Your Cake</Link></li>
                          <li><Link to="/my-custom-orders">My Custom Cakes</Link></li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="btn btn-link nav-link"
                              style={{ padding: 8 }}
                            >
                              Logout
                            </button>
                          </li>
                        </>
                      )}

                      {!role && (
                        <>
                          <li><Link to="/register">Register</Link></li>
                          <li><Link to="/login">Login</Link></li>
                        </>
                      )}
                    </>
                  )}
                </ul>

                {/* Menu Toggle Button */}
                <a
                  className={`menu-trigger ${menuOpen ? 'active' : ''}`}
                  onClick={toggleMenu}
                >
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Nav;
