import React, { useState, useContext } from 'react';
import { Shield, User, Lock, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const [privacyMode, setPrivacyMode] = useState(false);
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    updateUser({ name, email });
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Account Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your privacy, security, and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Privacy & Security */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} className="text-gradient" /> Privacy & Security
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EyeOff size={18} color={privacyMode ? "var(--success)" : "var(--text-muted)"} /> 
                Resume Privacy Mode
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                When enabled, your name, email, and phone number are completely masked before being sent to our AI for analysis.
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={privacyMode} 
                onChange={() => setPrivacyMode(!privacyMode)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: privacyMode ? 'var(--success)' : 'var(--bg-tertiary)',
                transition: '.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '16px', width: '16px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                  transform: privacyMode ? 'translateX(26px)' : 'translateX(0)'
                }}></span>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--text-muted)" /> 
                Data Retention
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Automatically delete my parsed resume data after 30 days.
              </p>
            </div>
            <button className="btn btn-secondary">Configure</button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} className="text-gradient" /> Profile Information
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>Save Changes</button>
              {saveMessage && <span style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '8px' }}>{saveMessage}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
