// Script to add to your thank you page (https://agendaverse.com/thank-you)
(function() {
  // Only run on the thank you page
  if (window.location.pathname.includes('/thank-you')) {
    console.log('Thank you page detected, sending notification...');
    
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our serverless function
    fetch('https://agenda-to-slack-3-dsiadlpf8-hannah-8751s-projects.vercel.app/api/notify-visit', {
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
        console.log('Notification sent successfully');
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
