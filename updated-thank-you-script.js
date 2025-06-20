// Script to add to your thank you page that works with Vercel serverless function
(function() {
  // Only run on the thank you page
  if (window.location.pathname.includes('/thank-you')) {
    // Get referrer information
    const referrer = document.referrer || 'Direct visit';
    
    // Send notification to our Vercel serverless function
    fetch('https://agenda-to-slack-3-dsiadlpf8-hannah-8751s-projects.vercel.app/api/notify-visit', {  // Using the actual Vercel deployment URL
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
