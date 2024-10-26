import React from 'react';
import TableauEmbed from '../components/Dashboards/TableauEmbed';

const Dashboard = () => {
  // Sustituye esta URL por la URL real de tu dashboard en Tableau Cloud
  const embedUrl = 'https://app.powerbi.com/groups/me/reports/33144240-fd2a-4077-b8a6-b6ef6fc8ce81/ea3baf38e94069e7e8db'; 
  const reportId = '33144240-fd2a-4077-b8a6-b6ef6fc8ce81';
  //const tableauDashboardUrl = "https://your-tableau-server-url/views/YOUR_DASHBOARD";

  return (
      
            <iframe title="DashboardMeetUp" width="1600px" height="800px" src="https://app.powerbi.com/view?r=eyJrIjoiMTVkZTliZjMtYTdmYy00MjUwLWI2MDgtYTRhNjdjNjUwMWU5IiwidCI6IjBmNzg1NDlkLTNlZWMtNDNhZi1iNTZhLTZmN2IwNDJkNmM5YSIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
      
  );
};

export default Dashboard;
