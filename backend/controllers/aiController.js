import { analyzeJobFit } from '../services/aiService.js';

const getJobAnalysis = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    
    if (!userId || !jobId) {
      return res.status(400).json({ 
        error: "userId ve jobId gerekli" 
      });
    }

    const result = await analyzeJobFit(userId, jobId);
    res.json({ 
      success: true,
      percentage: result.percentage,
      analysis_result: result.analysis_result,
      message: "İş uyum analizi tamamlandı ve kaydedildi"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getJobAnalysis };