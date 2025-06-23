// Tracking pixel endpoint for reliable thank you page notifications
const axios = require('axios');

export default async function handler(req, res) {
  // Set headers for the tracking pixel (transparent 1x1 GIF)
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Create a 1x1 transparent GIF
  const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  
  try {
    // Get referrer and other information
    const referrer = req.headers.referer || 'Direct visit';
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    const timestamp = new Date().toLocaleString();
    const query = req.query || {};
    
    // Log the request for debugging
    console.log('Pixel request received:');
    console.log('- Referrer:', referrer);
    console.log('- User Agent:', userAgent);
    console.log('- Timestamp:', timestamp);
    
    // Slack webhook URL from environment variable
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (webhookUrl) {
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
      
      // Send notification to Slack (don't await to avoid delaying the pixel response)
      axios.post(webhookUrl, message)
        .then(() => console.log('Notification sent to Slack successfully'))
        .catch(error => console.error('Error sending notification:', error));
    } else {
      console.error('No Slack webhook URL configured');
    }
  } catch (error) {
    console.error('Error processing pixel request:', error);
  }
  
  // Always return the transparent GIF
  return res.send(transparentGif);
}
