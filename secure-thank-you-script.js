// Secure script for thank you page - uses proxy endpoint instead of direct webhook
(function() {
  // Only run on the thank you page
  if (window.location.pathname.includes('/thank-you')) {
    console.log('Thank you page detected, sending notification via secure proxy...');
    
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our proxy endpoint (NOT directly to Slack)
    fetch('https://agenda-to-slack-2j2w.vercel.app/api/slack-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referrer: referrer,
        page: window.location.href,
        timestamp: new Date().toISOString()
      }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Notification sent successfully via secure proxy');
      } else {
        console.error('Failed to send notification:', response.status);
      }
    })
    .catch(error => {
      // Silent fail - don't affect user experience if notification fails
      console.error('Error sending visit notification:', error);
    });
  }
})();
