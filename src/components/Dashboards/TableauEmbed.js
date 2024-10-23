import React, { useEffect, useRef } from 'react';

const TableauEmbed = () => {
  const vizRef = useRef(null);

  useEffect(() => {
    const initViz = () => {
      const vizContainer = vizRef.current;

      
      const tableauServerUrl = "https://us-east-1.online.tableau.com";
      const personalAccessToken = "s63RrKPnQ8GiRH2peGDNfA==:jiM4nZxYhXbf1Sh63yDaQztYTpkgEZ6r";
      const siteName = "elhilario-bc1498df95";
      const dashboardUrl = "/t/elhilario-bc1498df95/views/MeetUpDashboards/Dashboard2";

      const fullUrl = `${tableauServerUrl}${dashboardUrl}`;

      const options = {
        hideTabs: true,
        hideToolbar: true,
        width: '100%',
        height: '100%',
        onFirstInteractive: () => {
          console.log('Dashboard is interactive');
        },
      };

      // Crear la visualización de Tableau
      new window.tableau.Viz(vizContainer, fullUrl, options);

      // Autenticación usando el token personal
      fetch(fullUrl, {
        method: 'GET',
        headers: {
          'X-Tableau-Auth': personalAccessToken,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al autenticar con Tableau');
        }
        // Aquí puedes realizar más acciones si es necesario
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };

    initViz();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={vizRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default TableauEmbed;