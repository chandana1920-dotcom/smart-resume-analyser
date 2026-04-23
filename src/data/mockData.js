export const mockAIFeedback = {
  atsScore: 82,
  summarySuggestions: [
    "Highlight your impact rather than just responsibilities. E.g., 'Increased efficiency by 15%'.",
    "Include more industry-specific keywords like 'React', 'TypeScript', and 'Microservices'.",
  ],
  experienceSuggestions: [
    {
      role: "Software Engineer",
      original: "Worked on frontend features using React.",
      suggestion: "Spearheaded the development of 3 new frontend modules using React, improving user retention by 10%."
    },
    {
      role: "Junior Developer",
      original: "Fixed bugs in the backend.",
      suggestion: "Resolved 50+ critical backend bugs, reducing server downtime by 20% over 6 months."
    }
  ],
  predictedRole: "Senior Frontend Engineer",
  keywordDensity: [
    { keyword: "React", count: 8, optimal: 10 },
    { keyword: "Node.js", count: 3, optimal: 5 },
    { keyword: "JavaScript", count: 12, optimal: 15 },
    { keyword: "Docker", count: 1, optimal: 4 },
  ],
  skillGaps: [
    { skill: "TypeScript", importance: "High", resource: "TypeScript for React Course" },
    { skill: "GraphQL", importance: "Medium", resource: "GraphQL Basics" },
    { skill: "AWS", importance: "High", resource: "AWS Certified Developer" }
  ],
  heatmapData: [
    { category: "Frontend", match: 90, gap: 10 },
    { category: "Backend", match: 60, gap: 40 },
    { category: "DevOps", match: 30, gap: 70 },
    { category: "Testing", match: 75, gap: 25 },
  ]
};
