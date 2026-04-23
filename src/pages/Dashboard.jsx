import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { mockAIFeedback } from '../data/mockData';
import { Download, Sparkles, Target, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('resumeAnalysis');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>No Resume Data Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Please upload a resume to see your dynamic AI analysis.</p>
        <Link to="/upload" className="btn btn-primary">Go to Upload</Link>
      </div>
    );
  }

  const handleDownload = () => {
    const reportText = `
SMART RESUME ANALYZER REPORT
----------------------------------
Predicted Role: ${data.predictedRole}
ATS Score: ${data.atsScore}/100

AI SUMMARY SUGGESTIONS:
${data.summarySuggestions.map(s => `- ${s}`).join('\n')}

EXPERIENCE ENHANCEMENTS:
${data.experienceSuggestions.map(exp => `- Role: ${exp.role}\n  Suggestion: ${exp.suggestion}`).join('\n\n')}

SKILL GAPS DETECTED:
${data.skillGaps.map(gap => `- Missing: ${gap.skill} (${gap.importance} Priority)`).join('\n')}
    `;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resume_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    localStorage.removeItem('resumeAnalysis');
    window.location.reload();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Resume Analytics</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is your AI-powered resume analysis.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleClear} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            Clear Data
          </button>
          <button className="btn btn-secondary" onClick={handleDownload}>
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {/* ATS Score Card */}
        <motion.div 
          className="glass-panel" 
          style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '16px' }}>ATS Match Score</h3>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--success)"
                strokeWidth="3"
                strokeDasharray={`${data.atsScore}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${data.atsScore}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{data.atsScore}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>/100</span>
            </div>
          </div>
          <div className="badge badge-success" style={{ marginTop: '16px' }}>Excellent Match</div>
        </motion.div>

        {/* Role Prediction Card */}
        <motion.div 
          className="glass-panel" 
          style={{ padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Target size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Predicted Role</h3>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>{data.predictedRole}</p>
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
            Based on your skills and experience, this resume is highly optimized for Frontend roles.
          </div>
        </motion.div>

        {/* AI Summary card */}
        <motion.div 
          className="glass-panel" 
          style={{ padding: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--warning)" />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>AI Suggestions</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.summarySuggestions.map((sug, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent-primary)' }}>•</span> {sug}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Experience Enhancements */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-gradient" /> Experience Enhancer
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.experienceSuggestions.map((exp, index) => (
              <div key={index} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{exp.role}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span className="badge badge-danger" style={{ marginBottom: '4px', display: 'inline-block' }}>Original</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"{exp.original}"</p>
                  </div>
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '4px', display: 'inline-block' }}>AI Optimized</span>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>"{exp.suggestion}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--danger)" /> Skill Gaps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.skillGaps.map((gap, index) => (
              <div key={index} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${gap.importance === 'High' ? 'var(--danger)' : 'var(--warning)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>{gap.skill}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gap.importance} Priority</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                  Recommended: {gap.resource}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
