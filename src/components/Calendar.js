import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/Calendar.css';
import { Button } from "antd";
import { Form } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventForm from './EventForm';
import '../components/EventForm.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleSelectSlot = (slotInfo) => {
        console.log('Selected slot: ', slotInfo);
    };

    const [form] = Form.useForm();


    const handleAddEvent = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleEventCreated = (newEvent) => {
        setEvents([...events, newEvent]);
        setShowForm(false); // Cerrar el formulario una vez que se crea el evento
    };

    // const fetchEvents = async () => {
    //     try {
    //         const res = await fetch('http://localhost:3030/api/events');
    //         const data = await res.json();
    //         const mappedEvents = data.map(event => ({
    //             id: event.id_evento,
    //             title: event.nombre_evento,
    //             start: new Date(event.fecha_inicio + ' ' + event.hora_inicio),
    //             end: new Date(event.fecha_finalizacion + ' ' + event.hora_culminacion),
    //             description: event.descripcion,
    //         }));
    //         setEvents(mappedEvents);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error al obtener lista de eventos:", error);
    //         setLoading(false);
    //     }
    // };

    const simulatedEvents = [
        {
          id: 1,
          title: "Conferencia Tech",
          start: new Date('2024-10-25T10:00:00'),
          end: new Date('2024-10-25T12:00:00'),
          description: "Conferencia anual de tecnología en el auditorio",
        },
        {
          id: 2,
          title: "Reunión de Negocios",
          start: new Date('2024-10-27T14:00:00'),
          end: new Date('2024-10-27T15:30:00'),
          description: "Reunión con clientes para la revisión del proyecto",
        },
        {
          id: 3,
          title: "Cumpleaños de Juan",
          start: new Date('2024-10-30T18:00:00'),
          end: new Date('2024-10-30T21:00:00'),
          description: "Fiesta de cumpleaños en el salón de eventos",
        }
      ];

    // useEffect(() => {
    //     fetchEvents(); // Cargar los eventos cuando el componente se monta
    // }, []);

    useEffect(() => {
        // En lugar de fetchEvents, usamos los eventos simulados
        setTimeout(() => {
          setEvents(simulatedEvents);
          setLoading(false);
        }, 1000); // Simulamos un pequeño retraso de carga
      }, []);

    return (
        <div className="calendar-container">
            <div className="header-container">
                <h1>Calendario de Eventos</h1>
                <div>
                    <Button type="primary" onClick={handleAddEvent} iconPosition="end" icon={<FontAwesomeIcon icon={faPlus} />}>
                        Crear Evento
                    </Button>
                </div>
            </div>

            {loading ? (
                <p>Cargando eventos...</p>
            ) : (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    style={{ height: 500 }}
                />
            )}

            {showForm && (
                <div className="form-popup">
                    <EventForm onEventCreated={handleEventCreated} />
                    <Button onClick={handleCloseForm}>Cerrar</Button>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;
