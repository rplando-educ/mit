import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="min-w-0 max-w-full overflow-x-hidden lg:flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 max-w-full flex-1 overflow-x-hidden">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
