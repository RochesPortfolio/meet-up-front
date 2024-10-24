import React from 'react';
import TableauEmbed from '../components/Dashboards/TableauEmbed';

const Dashboard = () => {
  // Sustituye esta URL por la URL real de tu dashboard en Tableau Cloud
  const tableauUrl = 'https://us-east-1.online.tableau.com/t/elhilario-bc1498df95/views/MeetUpDashboards/Dashboard2'; 

  return (
    <div className="App">
      <h1>Tableau Dashboard Embedded in React</h1>
      <TableauEmbed />
    </div>
  );
};

export default Dashboard;
