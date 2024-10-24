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
import EventDetails from './EventDetails';
import EventSimple from './EventSimple';
import { Widgets } from '@material-ui/icons';

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

    const fetchEvents = async () => {
        try {
            const today = new Date();
            let currentMonth = today.getMonth() + 1;
            let currentYear = today.getFullYear();

            let nextMonth = currentMonth + 1;
            let nextYear = currentYear;

            if (currentMonth == 12) {
                nextMonth = 1;
                nextYear = currentYear + 1;
            }
            const urlCurrentMonth = `http://localhost:3030/api/events/${currentMonth}/${currentYear}`;
            const urlNextMonth = `http://localhost:3030/api/events/${nextMonth}/${nextYear}`;

            const resCurrentMonth = await fetch(urlCurrentMonth);
            const eventsCurrentMonth = await resCurrentMonth.json();

            const resNextMonth = await fetch(urlNextMonth);
            const eventsNextMonth = await resNextMonth.json();

            const eventsArrayCurrentMonth = Array.isArray(eventsCurrentMonth.data) ? eventsCurrentMonth.data : [];
            const eventsArrayNextMonth = Array.isArray(eventsNextMonth.data) ? eventsNextMonth.data : [];

            const allEvents = [...eventsArrayNextMonth, ...eventsArrayCurrentMonth];
            console.log(allEvents);
            const mappedEvents = allEvents.map(event => ({
                id: event.id_evento,
                title: event.nombre_evento,
                start: new Date(event.fecha_inicio + ' ' + event.hora_inicio),
                end: new Date(event.fecha_finalizacion + ' ' + event.hora_culminacion),
                description: event.descripcion,
                lugar_evento: event.lugar_evento,
                aforo_evento: event.aforo_evento,
                tipo_evento: event.tipo_evento,
                rubro_negocio: event.rubro_negocio
            }));
            setEvents(mappedEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(); // Cargar los eventos cuando el componente se monta
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
                    style={{ height: 600, width: 1200 }}
                    views={['month', 'week', 'day']}
                    components={{
                        month: {
                            event: EventSimple,
                        },
                        week: {
                            event: EventDetails,
                        },
                        day: {
                            event: EventDetails,
                        },
                    }}
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
