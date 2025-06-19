# Implementation Guide for Agenda Thank You Page Slack Notifier

This guide provides detailed steps to implement the Slack notification system for your thank you page.

## Option 1: JavaScript Integration (Easiest)

### Step 1: Create a Slack Incoming Webhook
1. Go to [Slack API Apps page](https://api.slack.com/apps)
2. Click "Create New App" > "From scratch"
3. Name your app (e.g., "Thank You Page Notifier") and select your workspace
4. Click on "Incoming Webhooks" in the sidebar
5. Toggle "Activate Incoming Webhooks" to On
6. Click "Add New Webhook to Workspace"
7. Select the channel where you want notifications to appear
8. Copy the webhook URL provided - you'll need this later

### Step 2: Deploy the Notification Server
1. Clone this repository to your server
2. Run `npm install` to install dependencies
3. Create a `.env` file based on `.env.example` and add your Slack webhook URL
4. Start the server with `npm start` (use PM2 or similar for production)

### Step 3: Add the Notification Script to Your Thank You Page
Add this script to your thank you page (update the URL to your server):

```html
<script>
  // Only execute on thank you page
  document.addEventListener('DOMContentLoaded', function() {
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our server
    fetch('https://your-server-url.com/notify-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referrer: referrer,
        page: window.location.href
      }),
    })
    .catch(error => {
      // Silent fail - don't affect user experience
      console.error('Error sending notification:', error);
    });
  });
</script>
```

## Option 2: Google Tag Manager Integration

If you're using Google Tag Manager, you can:

1. Create a new tag of type "Custom HTML"
2. Paste the script above into the tag
3. Set the trigger to fire on the thank you page URL
4. Publish your changes

## Option 3: Server-Side Integration

If you have access to the server code that renders the thank you page:

1. Add server-side code to call the notification endpoint when the page is rendered
2. This provides more reliable tracking as it's not dependent on client-side JavaScript

## Testing Your Integration

1. Deploy your notification server
2. Configure your thank you page with the notification script
3. Visit your thank you page
4. Check your Slack channel for the notification

## Troubleshooting

- **No notifications appearing**: Check server logs, verify webhook URL is correct
- **CORS errors**: Ensure your server's CORS settings allow requests from your website
- **Rate limiting**: Slack has rate limits on incoming webhooks, check if you're hitting them
