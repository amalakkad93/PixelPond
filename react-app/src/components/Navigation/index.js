import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../assets/images/logo.png';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink exact to="/posts/all">
          <img src={logo} alt="logo" className="logo-img" />
        </NavLink>
      </div>

      <ul className="navbar-links">
        {sessionUser && (
          <li>
            <NavLink to="/my-photos" activeClassName="active">My Photos</NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
