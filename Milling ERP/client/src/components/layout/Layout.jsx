import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Fixed sidebar */}
      <div className="fixed inset-y-0 left-0 w-60">
        <Sidebar />
      </div>

      {/* Main content, offset by sidebar width */}
      <div className="ml-60 flex h-screen flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;