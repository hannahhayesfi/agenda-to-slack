require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve the demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

// Route to handle thank you page visits
app.post('/notify-visit', async (req, res) => {
  try {
    const timestamp = new Date().toLocaleString();
    const referrer = req.body.referrer || 'Unknown source';
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    
    // Send notification to Slack
    await sendSlackNotification({
      timestamp,
      referrer,
      userAgent
    });
    
    res.status(200).json({ success: true, message: 'Notification sent to Slack' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Function to send notification to Slack
async function sendSlackNotification(data) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('Slack webhook URL not configured');
  }
  
  console.log(`Sending notification to Slack using webhook: ${webhookUrl.substring(0, 30)}...`);
  
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
            text: `*When:*\n${data.timestamp}`
          },
          {
            type: "mrkdwn",
            text: `*Source:*\n${data.referrer}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Device:*\n${data.userAgent}`
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
  
  await axios.post(webhookUrl, message);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
