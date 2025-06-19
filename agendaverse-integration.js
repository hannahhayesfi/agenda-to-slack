// Agendaverse Thank You Page Notification Script
// Add this script to your thank-you page at https://agendaverse.com/thank-you

(function() {
  // Only run on the thank you page
  if (window.location.pathname.includes('/thank-you')) {
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our server
    fetch('http://localhost:3000/notify-visit', {  // Replace with your deployed server URL in production
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
    .catch(error => {
      // Silent fail - don't affect user experience if notification fails
      console.error('Error sending visit notification:', error);
    });
  }
})();
