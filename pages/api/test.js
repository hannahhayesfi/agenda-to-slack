// Simple test endpoint for Vercel
export default function handler(req, res) {
  // Set CORS headers to allow requests from anywhere for testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    env: {
      hasWebhook: !!process.env.SLACK_WEBHOOK_URL
    }
  });
}
