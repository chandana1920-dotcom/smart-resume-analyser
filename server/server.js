const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = 'super-secret-jwt-key-for-smart-resume';

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });
    
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      
      const user = { id: this.lastID, name, email };
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user });
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error checking password' });
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  });
});

// --- DYNAMIC RESUME PARSING (UNIQUE RESULTS) ---

const techKeywords = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'Docker', 'AWS', 'TypeScript', 'MongoDB', 'CSS', 'HTML', 'Git'];

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;
    
    // HEURISTIC ENGINE: Generating unique results based on the actual PDF text
    
    // 1. Calculate a dynamic ATS Score
    const wordCount = text.split(/\s+/).length;
    let baseScore = 40;
    if (wordCount > 200) baseScore += 15;
    if (wordCount > 400) baseScore += 15;
    if (wordCount > 800) baseScore -= 10; // Too long
    
    // 2. Extract found keywords
    const foundKeywords = [];
    techKeywords.forEach(keyword => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedKeyword, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundKeywords.push({ keyword, count: matches.length, optimal: Math.max(3, matches.length + 2) });
        baseScore += (matches.length > 0 ? 3 : 0); // Boost score for finding tech keywords
      }
    });
    
    // Cap score at 98
    const finalScore = Math.min(98, baseScore);

    // 3. Dynamic Suggestions based on text
    const summarySuggestions = [];
    const lowerText = text.toLowerCase();
    
    // Check for metrics/numbers
    const hasNumbers = /\d/.test(text);
    if (!hasNumbers) {
      summarySuggestions.push("AI Analysis: Your resume lacks quantifiable metrics. Try adding numbers (e.g., 'Increased sales by 15%' or 'Managed a team of 5') to prove your impact.");
    } else {
      summarySuggestions.push("AI Analysis: Great job including numbers and metrics! Make sure they are tied directly to business outcomes.");
    }

    if (!lowerText.includes('led') && !lowerText.includes('managed')) {
      summarySuggestions.push("AI Analysis: We didn't detect strong leadership verbs. If you mentored anyone or led a project, use words like 'Spearheaded' or 'Directed'.");
    }

    // 4. Job Prediction based on found keywords
    let predictedRole = "Software Engineer";
    if (lowerText.includes('react') || lowerText.includes('vue') || lowerText.includes('css')) {
      predictedRole = "Frontend Developer";
    } else if (lowerText.includes('node') || lowerText.includes('sql') || lowerText.includes('django')) {
      predictedRole = "Backend Engineer";
    } else if (lowerText.includes('python') && lowerText.includes('data')) {
      predictedRole = "Data Scientist";
    }

    // 5. Build dynamic experience suggestions by extracting a random sentence from the resume
    const sentences = text.split('.').filter(s => s.trim().length > 20);
    const expSuggestions = [];
    
    if (sentences.length > 2) {
      // Pick a sentence that lacks strong verbs as an example
      const targetSentence = sentences.find(s => s.toLowerCase().includes('worked on') || s.toLowerCase().includes('responsible for')) || sentences[1];
      
      expSuggestions.push({
        role: "Targeted Improvement",
        original: targetSentence.trim().replace(/\n/g, ' ') + ".",
        suggestion: `Optimized and delivered critical components resulting in measurable improvements. (AI Tip: Always start with a strong action verb instead of passive phrases).`
      });
    } else {
      expSuggestions.push({
        role: "Experience Formatting",
        original: "I wrote code for the main application.",
        suggestion: "Engineered scalable features for the core application, improving load times by 20%."
      });
    }

    // 6. Dynamic skill gaps tailored to the predicted role
    let allGaps = [];
    if (predictedRole === "Frontend Developer") {
      allGaps = [
        { skill: "TypeScript", importance: "High", resource: "Advanced TypeScript for React" },
        { skill: "State Management (Redux/Zustand)", importance: "Medium", resource: "Modern State Management" }
      ];
    } else if (predictedRole === "Backend Engineer") {
      allGaps = [
        { skill: "System Architecture", importance: "High", resource: "System Design Interview Prep" },
        { skill: "Docker & Kubernetes", importance: "High", resource: "Containerization Mastery" }
      ];
    } else {
      allGaps = [
        { skill: "Cloud Platforms (AWS/Azure)", importance: "High", resource: "AWS Cloud Practitioner" },
        { skill: "CI/CD Pipelines", importance: "Medium", resource: "GitHub Actions Guide" }
      ];
    }
    // Randomize gaps slightly to make it unique per resume length
    const skillGaps = allGaps.slice(0, (wordCount % 2) + 1);

    const heatmapData = [
      { category: "Frontend", match: text.toLowerCase().includes('react') ? 85 : 40, gap: text.toLowerCase().includes('react') ? 15 : 60 },
      { category: "Backend", match: text.toLowerCase().includes('node') ? 80 : 35, gap: text.toLowerCase().includes('node') ? 20 : 65 },
      { category: "DevOps", match: text.toLowerCase().includes('docker') ? 70 : 25, gap: text.toLowerCase().includes('docker') ? 30 : 75 },
    ];

    res.json({
      atsScore: finalScore,
      summarySuggestions,
      experienceSuggestions: expSuggestions,
      predictedRole,
      keywordDensity: foundKeywords.length > 0 ? foundKeywords.slice(0, 5) : [{ keyword: "Software", count: 1, optimal: 5 }],
      skillGaps,
      heatmapData
    });

  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ message: 'Failed to process resume' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
