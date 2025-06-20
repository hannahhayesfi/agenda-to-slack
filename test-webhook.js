// Simple script to test if the Slack webhook URL is valid
require('dotenv').config();
const axios = require('axios');

async function testWebhook() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('Error: SLACK_WEBHOOK_URL is not defined in your environment');
    process.exit(1);
  }
  
  console.log(`Testing webhook URL (first 15 chars): ${webhookUrl.substring(0, 15)}...`);
  
  try {
    const message = {
      text: "This is a test message from the webhook validation script."
    };
    
    const response = await axios.post(webhookUrl, message);
    console.log('Success! Webhook is valid. Response:', response.status, response.statusText);
  } catch (error) {
    console.error('Error testing webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWebhook();
