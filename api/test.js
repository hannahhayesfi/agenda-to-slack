// Simple test endpoint for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    env: {
      hasWebhook: !!process.env.SLACK_WEBHOOK_URL
    }
  });
};
