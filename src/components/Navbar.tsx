import { Sun, Moon, LogOut } from 'react-feather';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function Navbar({ isAuthenticated, onLogout, darkMode, onToggleDarkMode }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <span className="navbar-brand">Task Manager</span>
        {isAuthenticated && (
          <div className="ms-auto d-flex align-items-center">
            <button
              className="btn btn-icon me-2 btn-secondary d-flex align-items-center justify-content-center"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="btn btn-danger"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={20} className="me-2" />
              <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

