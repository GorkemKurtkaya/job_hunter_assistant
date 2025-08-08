import { analyzeJobFit } from '../services/aiService.js';

const getJobAnalysis = async (req, res) => {
  try {
    const { profile, jobDescription } = req.body;
    const result = await analyzeJobFit(profile, jobDescription);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getJobAnalysis };