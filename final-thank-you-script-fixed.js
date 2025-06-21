// Final script for thank you page with quick redirect
// This script uses multiple approaches to ensure notification is sent

(function() {
  console.log('Thank you page script loaded');
  
  // Get referrer information
  const referrer = document.referrer || 'Direct visit';
  
  // Create the data payload
  const data = {
    referrer: referrer,
    page: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  // Method 1: Use sendBeacon API (best for page unload/redirect)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const success = navigator.sendBeacon(
      'https://agenda-to-slack-3-ab58toijp-hannah-8751s-projects.vercel.app/api/notify-visit', 
      blob
    );
    console.log('Notification sent via sendBeacon:', success);
  } 
  // Method 2: Fallback to fetch with keepalive
  else {
    fetch('https://agenda-to-slack-3-ab58toijp-hannah-8751s-projects.vercel.app/api/notify-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true // This helps the request complete even if page unloads
    })
    .then(response => {
      if (response.ok) {
        console.log('Notification sent successfully');
      } else {
        console.error('Failed to send notification:', response.status);
      }
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
  }
})();
