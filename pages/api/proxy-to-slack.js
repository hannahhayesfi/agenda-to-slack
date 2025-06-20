// This is a secure proxy endpoint that forwards notifications to Slack
// The webhook URL is only stored on the server and never exposed to clients
const axios = require('axios');

export default async function handler(req, res) {
  // Set CORS headers to allow requests from agendaverse.com
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    
    // Get Slack webhook URL from environment variable
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
    
    // Send notification to Slack through secure proxy
    await axios.post(webhookUrl, message);
    
    // Return success response without exposing the webhook URL
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
