// Script to notify server when someone visits the thank you page
(function() {
  // Only run on the thank you page
  if (window.location.pathname.includes('/thank-you')) {
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our server
    fetch('https://your-notification-server.com/notify-visit', {
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
      // Silent fail - don't affect user experience if notification fails
      console.error('Error sending visit notification:', error);
    });
  }
})();
