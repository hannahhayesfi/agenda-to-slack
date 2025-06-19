# Agenda Thank You Page Slack Notifier

This application sends a Slack notification whenever someone visits the "Thank You" page on agendaverse.com.

## Features

- Detects visits to https://agendaverse.com/thank-you
- Sends real-time notifications to a Slack channel or users
- Easy to deploy and maintain

## Setup Instructions

1. Install dependencies: `npm install`
2. Configure your Slack webhook URL in `.env` file
3. Start the server: `npm start`
4. Set up the proxy on your website (see below)

## Configuration

Copy `.env.example` to `.env` and fill in your Slack webhook URL:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## How It Works

This application works by:
1. Setting up a proxy/redirect on the thank-you page
2. When someone visits the page, our server gets notified
3. Our server then sends a notification to Slack

## Deployment

See the deployment section for instructions on how to deploy this service.
