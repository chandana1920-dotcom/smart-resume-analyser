import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, GitCommit } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('resumeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>No History Yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Upload your first resume to start tracking your progress over time.</p>
        <Link to="/upload" className="btn btn-primary">Go to Upload</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Resume Version History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your progress and compare different resume versions.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={20} className="text-gradient" /> Version Timeline
          </h3>
          <button className="btn btn-secondary">Compare Selected</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <th style={{ padding: '16px 8px' }}></th>
              <th style={{ padding: '16px 8px' }}>Date</th>
              <th style={{ padding: '16px 8px' }}>Filename</th>
              <th style={{ padding: '16px 8px' }}>ATS Score</th>
              <th style={{ padding: '16px 8px' }}>Status</th>
              <th style={{ padding: '16px 8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 8px' }}><input type="checkbox" /></td>
                <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" /> {item.date}
                </td>
                <td style={{ padding: '16px 8px', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', backgroundColor: item.score > 70 ? 'var(--success)' : item.score > 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{item.score}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <span className={`badge ${item.score > 70 ? 'badge-success' : item.score > 50 ? 'badge-warning' : 'badge-danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
