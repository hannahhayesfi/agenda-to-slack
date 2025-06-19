// Serverless function for Vercel
const axios = require('axios');

// This function will be deployed as a serverless function on Vercel
module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming request data
    const data = req.body;
    const timestamp = new Date().toLocaleString();
    const referrer = data.referrer || 'Unknown source';
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    
    // Slack webhook URL from environment variable
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.status(500).json({ 
        success: false, 
        message: 'Slack webhook URL not configured' 
      });
    }
    
    // Create Slack message
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎉 New Thank You Page Visit!",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*When:*\n${timestamp}`
            },
            {
              type: "mrkdwn",
              text: `*Source:*\n${referrer}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Device:*\n${userAgent}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Someone has completed the form on agendaverse.com"
            }
          ]
        }
      ]
    };
    
    // Send notification to Slack
    await axios.post(webhookUrl, message);
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Notification sent to Slack' 
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification', 
      error: error.message 
    });
  }
}
