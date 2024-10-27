// src/components/PowerBIReport.js
import React, { useEffect } from 'react';

const DashboardEmbed = () => {
    useEffect(() => {
        // Definir la función asíncrona dentro de useEffect
        const fetchAndEmbedReport = async () => {
            try {
                // Solicitar el token de Power BI a tu backend
                const response = await fetch("http://localhost:3030/api/dash", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Error en la autenticación con el backend");
                }

                const data = await response.json();
                const embedContainer = document.getElementById('embedContainer');
                const reportId = '0d2b8787-843f-4f30-9572-eccc1dabbcf1'; // ID del informe
                const embedUrl = 'https://app.powerbi.com/groups/51a9a8f9-829a-4194-9e9f-9c1a1256f855/reports/0d2b8787-843f-4f30-9572-eccc1dabbcf1/ea3baf38e94069e7e8db'; // URL de incrustación
                const accessToken = data.access_token; // Token de acceso

                // Verifica si el cliente de Power BI ya está cargado
                if (!window.powerbi) {
                    console.error('Power BI client not loaded');
                    return; // Salir si el cliente no está disponible
                }

                embedReport(accessToken, embedContainer, reportId, embedUrl);
            } catch (error) {
                console.error("Error al incrustar el informe:", error);
            }
        };

        const embedReport = (accessToken, embedContainer, reportId, embedUrl) => {
            const models = window['powerbi-client'].models;

            const config = {
                type: 'report',
                tokenType: models.TokenType.Embed,
                accessToken: accessToken,
                embedUrl: embedUrl,
                id: reportId,
                settings: {
                    filterPaneEnabled: true,
                    navContentPaneEnabled: true,
                },
            };

            // Incrusta el informe en el contenedor
            window.powerbi.embed(embedContainer, config);
        };

        // Llama a la función para obtener el token y incrustar el informe
        fetchAndEmbedReport();

        // Limpieza al desmontar el componente
        return () => {
            const embedContainer = document.getElementById('embedContainer');
            window.powerbi.reset(embedContainer);
        };
    }, []);

    return (
        <div
            id="embedContainer"
            style={{ height: '600px', width: '100%' }} // Ajusta según tus necesidades
        />
    );
};

export default DashboardEmbed;








/*
//import React, { useEffect, useRef, useState } from 'react';
import React, { useEffect } from 'react';
//import * as powerbi from 'powerbi-client';

const DashboardEmbed = ({ embedUrl , reportId }) => {
    useEffect(async () => {


        // Solicitar el token de Tableau a nuestro backend proxy
        const response = await fetch("http://localhost:3030/api/dash", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        if (!response.ok) {
          throw new Error("Error en la autenticación con el backend");
        }

        const data = await response.json();
        //console.log("Tokeeen credenciales",data.access_token);
        const token = data.access_token;
        console.log("Tokeeeeeeen",token);
        const reportContainer = document.getElementById('reportContainer');
        const models = window['powerbi-client'].models;
        const config = {
            type: 'report',
            id: reportId,
            embedUrl: embedUrl,
            accessToken: response.access_token,
            tokenType:  models.TokenType.Embed,
        };

        const report = powerbi.embed(reportContainer, config);

        return () => {
            powerbi.reset(reportContainer);
        };
    }, [embedUrl, reportId]);

    return <div id="reportContainer" style={{ height: '600px' }}></div>;
};

export default DashboardEmbed;





*/















/*

const DashboardEmbed = () => {
    const vizRef = useRef(null);  // Referencia para el contenedor del dashboard

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Solicitar el token de Tableau a nuestro backend proxy
                  const response = await fetch("http://localhost:3030/api/dash", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (!response.ok) {
                  throw new Error("Error en la autenticación con el backend");
                }

                const reportContainer = document.getElementById('reportContainer');

                const config = {
                    type: 'report',
                    id: reportId,
                    embedUrl: embedUrl,
                    accessToken: accessToken,
                    tokenType: powerbi.models.TokenType.Embed,
                };

                const report = powerbi.embed(reportContainer, config);
                return () => {
                  powerbi.reset(reportContainer);
              };
            } catch (error) {
                console.error("Error al cargar el dashboard de Tableau:", error);
            }
        };

        loadDashboard();  // Llamada a la función de carga del dashboard

        // Limpieza de la instancia de Viz cuando el componente se desmonta
        return () => {
            if (vizRef.current && vizRef.current.viz) {
                vizRef.current.viz.dispose();
            }
        };
    }, []);

    return <div ref={vizRef} style={{ width: '100%', height: '600px' }} />;
};

export default DashboardEmbed;


*/
























/*


const TableauEmbed = ({ tableauUrl }) => {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateWithBackend = async () => {
      try {
        // Solicitar el token de Tableau a nuestro backend proxy
        const response = await fetch("http://localhost:3030/api/dash", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error en la autenticación con el backend");
        }

        const data = await response.json();
        console.log("Tokeeen credenciales",data.credentials.token);
        const token = data.credentials.token;

        // Construye la URL de Tableau con el token de sesión
        const tableauUrl = `https://us-east-1.online.tableau.com/t/cjazurdia-2ef28b40b7/views/MeetUpDashboards/Dashboard2?&:embed=y&:showVizHome=n&:tabs=n&:device=desktop&tableau-server-auth-token=${token}`

        // Configurar e incrustar el dashboard con el token de sesión
        if (window.tableau) {
          const vizOptions = {
            hideTabs: true,
            width: '100%',
            height: '600px',
        };

        new window.tableau.Viz(ref.current, tableauUrl, vizOptions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al autenticar y cargar el dashboard:", error);
      }
    };

    authenticateWithBackend();
  }, [tableauUrl]);

  return (
    <div>
      {loading && <p>Cargando dashboard...</p>}
      <div ref={ref} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default TableauEmbed;

*/



/*
const TableauEmbed = ({ tableauUrl }) => {


  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateWithTableau = async () => {
      try {
        const tableauServerUrl = "https://us-east-1.online.tableau.com"; // Cambia por tu Tableau Server
        const siteId = "cjazurdia-2ef28b40b7"; // ID del sitio en Tableau Server
        const personalAccessTokenName = "MeetUpAuth"; // El nombre de tu PAT
        const personalAccessTokenSecret = "v/JMUD7vQzuWnv4TFA7AiQ==:ka32o5K6KbkR3lAnrqnGZVreaEBHSXW4"; // El secreto de tu PAT

        // Hacer la solicitud de autenticación con fetch
        const response = await fetch(`${tableauServerUrl}/api/3.12/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credentials: {
              personalAccessTokenName,
              personalAccessTokenSecret,
              site: {
                contentUrl: siteId,
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la autenticación con Tableau');
        }

        const data = await response.json();
        const token = data.credentials.token;

        // Cargar el dashboard usando el token
        if (window.tableau) {
          const vizOptions = {
            hideTabs: true,
            width: '100%',
            height: '500px',
            device: 'desktop',
            'tableau-server-auth-token': token, // Pasamos el token para la autenticación
          };

          new window.tableau.Viz(ref.current, tableauUrl, vizOptions);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al autenticar y cargar el dashboard:', error);
      }
    };

    authenticateWithTableau();
  }, [tableauUrl]);

  return (
    <div>
      {loading && <p>Cargando dashboard...</p>}
      <div ref={ref} style={{ width: '100%', height: '500px' }} />
    </div>
  );

}

export default TableauEmbed; */
  /*
  const vizRef = useRef(null);

  useEffect(() => {
    const initViz = () => {
      const vizContainer = vizRef.current;

      https://us-east-1.online.tableau.com/t/cjazurdia-2ef28b40b7/views/MeetUpDashboards/Dashboard2?:origin=card_share_link&:embed=n


      const tableauServerUrl = "https://your-tableau-server-url";
      const siteId = "your-site-id"; // ID del sitio en Tableau Server
      const personalAccessTokenName = "your-pat-name";
      const personalAccessTokenSecret = "your-pat-secret";


      
      const tableauServerUrl = "https://us-east-1.online.tableau.com";
      const personalAccessToken = "v/JMUD7vQzuWnv4TFA7AiQ==:ka32o5K6KbkR3lAnrqnGZVreaEBHSXW4";
      const siteName = "elhilario-bc1498df95";
      const dashboardUrl = "/t/cjazurdia-2ef28b40b7/views/MeetUpDashboards/Dashboard2";
      
       // Hacer la solicitud de autenticación con fetch
       const response = await fetch(`${tableauServerUrl}/api/3.12/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: {
            personalAccessTokenName,
            personalAccessTokenSecret,
            site: {
              contentUrl: siteId,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la autenticación con Tableau');
      }

      const data = await response.json();
      const token = data.credentials.token;



















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
*/