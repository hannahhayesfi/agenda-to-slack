const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const timestamp = new Date().toLocaleString();
    const referrer = data.referrer || 'Unknown source';
    const userAgent = event.headers['user-agent'] || 'Unknown device';
    
    // Slack webhook URL from environment variable
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Slack webhook URL not configured' }) 
      };
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
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Notification sent to Slack' })
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to send notification', error: error.message })
    };
  }
};
