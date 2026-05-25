import { Link, useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoMenu, IoMoon, IoSunny } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import rampLogo from '../assets/ramp-logo.png';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 min-w-0 items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button className="focus-ring rounded-lg p-2 lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
            <IoMenu size={22} />
          </button>
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src={rampLogo} alt="RAMP" className="h-10 w-10 rounded-lg object-contain" />
            <span className="font-bold tracking-wide text-slate-950 dark:text-white">RAMP</span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button className="focus-ring rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <IoSunny size={20} /> : <IoMoon size={20} />}
          </button>
          {currentUser ? (
            <button className="focus-ring flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-slate-100 sm:px-3 dark:hover:bg-slate-800" onClick={handleLogout}>
              <IoLogOutOutline /> <span className="hidden xs:inline sm:inline">Logout</span>
            </button>
          ) : (
            <Link className="focus-ring rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:px-4" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
