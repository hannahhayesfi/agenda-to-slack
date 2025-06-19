// Simple index page for Vercel
export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>Agenda Slack Notification Service</h1>
      <p>This service sends notifications to Slack when someone visits the thank-you page.</p>
      <p>API endpoints:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><code>/api/notify-visit</code> - Endpoint to send notifications to Slack</li>
        <li><code>/api/test</code> - Test endpoint to verify the API is working</li>
      </ul>
    </div>
  );
}
