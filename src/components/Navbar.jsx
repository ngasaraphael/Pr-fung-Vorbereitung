import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/Navbar.css';

import { FaHome, FaUser, FaComments } from "react-icons/fa";

function Navbar() {
  const { level, setLevel } = useContext(LevelContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Prüfung Vorbereitung</div>

      <div className="navbar-controls">
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end>
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/community">
              <FaComments /> Community
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <FaUser /> Profil
            </NavLink>
          </li>
        </ul>
         <label className="level-label">
          Niveau:{' '}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="a2">A2</option>
            <option value="b1">B1</option>
            <option value="b2">B2</option>
          </select>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;
