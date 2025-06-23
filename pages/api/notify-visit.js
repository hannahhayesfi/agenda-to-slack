// Serverless function for Vercel with proper OPTIONS handling
const axios = require('axios');

// This function will be deployed as a serverless function on Vercel
export default async function handler(req, res) {
  // Always set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Accept');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    // Return 200 OK for OPTIONS requests with proper CORS headers
    return res.status(200).end();
  }

  // For GET requests, return a simple status message
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
      env: {
        hasWebhook: !!process.env.SLACK_WEBHOOK_URL
      }
    });
  }

  // Only allow POST requests for notifications
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming request data
    const data = req.body || {};
    const timestamp = new Date().toLocaleString();
    const referrer = data.referrer || req.headers.referer || 'Unknown source';
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    const page = data.page || 'Unknown page';
    
    // Log the request for debugging
    console.log('Notification request received:');
    console.log('- Referrer:', referrer);
    console.log('- Page:', page);
    console.log('- User Agent:', userAgent);
    console.log('- Timestamp:', timestamp);
    
    // Slack webhook URL from environment variable
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('No Slack webhook URL configured');
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
          fields: [
            {
              type: "mrkdwn",
              text: `*Page:*\n${page}`
            },
            {
              type: "mrkdwn",
              text: `*Device:*\n${userAgent}`
            }
          ]
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
    try {
      const slackResponse = await axios.post(webhookUrl, message);
      console.log('Slack notification sent successfully:', slackResponse.status);
      
      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: 'Notification sent to Slack' 
      });
    } catch (slackError) {
      console.error('Error sending to Slack:', slackError.message);
      if (slackError.response) {
        console.error('Slack response:', slackError.response.status, slackError.response.data);
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send notification to Slack', 
        error: slackError.message,
        slackStatus: slackError.response ? slackError.response.status : 'unknown',
        slackData: slackError.response ? slackError.response.data : 'unknown'
      });
    }
  } catch (error) {
    console.error('Error processing notification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process notification', 
      error: error.message 
    });
  }
}
