import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, LineChart, History, Settings, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Upload Resume', path: '/upload', icon: <FileUp size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px' }}>
        <div style={{ 
          background: 'var(--accent-gradient)', 
          padding: '8px', 
          borderRadius: '10px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Bot size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }} className="text-gradient">Smart Resume</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              transition: 'all 0.2s',
              fontWeight: isActive ? 500 : 400,
            })}
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pro Plan Active</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '3px' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4/10 Scans</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
