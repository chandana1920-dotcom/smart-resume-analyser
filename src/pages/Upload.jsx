import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, XCircle, FileText, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      
      // Save the unique analysis data to localStorage so other pages can use it
      localStorage.setItem('resumeAnalysis', JSON.stringify(data));

      // Append to History
      const existingHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: data.atsScore,
        name: file.name,
        status: data.atsScore >= 70 ? 'Strong Match' : 'Needs Work',
        fullData: data
      };
      localStorage.setItem('resumeHistory', JSON.stringify([newEntry, ...existingHistory]));
      
      setUploading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error analyzing resume. Make sure the backend server is running.');
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Upload Your Resume</h2>
        <p style={{ color: 'var(--text-muted)' }}>Our AI will analyze your resume against industry standards and provide actionable feedback.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Main Document Upload */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '40px', 
            textAlign: 'center',
            border: dragActive ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-color)',
            backgroundColor: dragActive ? 'rgba(139, 92, 246, 0.05)' : 'var(--glass-bg)',
            transition: 'all 0.3s ease'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center' 
              }}>
                <UploadCloud size={32} color="var(--accent-primary)" />
              </div>
              <div>
                <p style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '8px' }}>Drag & Drop your resume here</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports PDF, DOCX (Max 5MB)</p>
              </div>
              <div style={{ margin: '16px 0', color: 'var(--text-muted)' }}>OR</div>
              <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleChange} accept=".pdf,.doc,.docx" />
              <label htmlFor="file-upload" className="btn btn-secondary">
                Browse Files
              </label>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
            >
              <FileText size={48} color="var(--accent-secondary)" />
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{file.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div 
                      style={{ height: '100%', background: 'var(--accent-gradient)' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'easeInOut' }}
                    />
                  </div>
                  <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }} className="pulse-text">AI is analyzing your resume...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn btn-secondary" onClick={() => setFile(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAnalyze}>Analyze Resume</button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Video Resume Option */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <Video size={24} color="var(--text-secondary)" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Video Resume (Optional)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload a short 1-minute intro to stand out.</p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Upload Video</button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
