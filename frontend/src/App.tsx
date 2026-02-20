import React from 'react';
import './App.css';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface NavBarType {
  path: string;
  title: string;
}

const navBar: NavBarType[] = [
  {
    path: '/',
    title: 'Home',
  },
  {
    path: '/check-server-health',
    title: 'Check Server Health',
  },
  {
    path: '/transfer',
    title: 'New Transfer',
  },
  {
    path: '/pending-transfers',
    title: 'Pending Transfers',
  },
];

const App: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <nav className='navbar'>
        <ul className='navbar-list'>
          {navBar.map((eachNav) => {
            const isActive = pathname === eachNav.path;
            return (
              <li key={eachNav.path} className={`navbar-item${isActive ? ' active' : ''}`}>
                <Link to={eachNav.path} className='navbar-link'>
                  {eachNav.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
