import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Link } from 'react-router-dom';

const Analytics = () => {
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
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>No Analytics Available</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Please upload a resume first to view the analytics.</p>
        <Link to="/upload" className="btn btn-primary">Go to Upload</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Advanced Analytics</h2>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into how your resume matches job descriptions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Radar Chart for Skill Heatmap */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Resume vs Job Description Heatmap</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.heatmapData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Match" dataKey="match" stroke="var(--success)" fill="var(--success)" fillOpacity={0.4} />
                <Radar name="Gap" dataKey="gap" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></span> Match</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', backgroundColor: 'var(--danger)', borderRadius: '2px' }}></span> Gap</div>
          </div>
        </div>

        {/* Keyword Density Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Keyword Density Analysis</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.keywordDensity} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="keyword" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" name="Current Count" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="optimal" name="Optimal Target" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
            Compare your keyword frequency against top-performing resumes in this role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
