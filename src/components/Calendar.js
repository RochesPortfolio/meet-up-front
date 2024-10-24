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
import { Snackbar } from '@material-ui/core';
import '../components/EventForm.css';
import EventDetails from './EventDetails';
import EventSimple from './EventSimple';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleSelectSlot = (slotInfo) => {
        console.log('Selected slot: ', slotInfo);
    };

    const [form] = Form.useForm();

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

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

    const [formData, setFormData] = useState({
        nombre_evento: '',
        lugar_evento: '',
        aforo_evento: '',
        tipo_evento: '',
        descripcion: '',
        rubro_negocio: '',
        hora_inicio: '',
        hora_culminacion: '',
        fecha_inicio: '',
        fecha_finalizacion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3030/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newEvent = await res.json();
                handleEventCreated(newEvent);
                setOpenSnackbar('Evento creado con éxito');
                await fetchEvents();
            } else {
                setOpenSnackbar('Error al crear el evento');
            }
        } catch (error) {
            console.error('Error al crear el evento:', error);
        }
        finally {
            setLoading(false);
        }
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Evento creado con éxito"
            />
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
                    {/* <EventForm onEventCreated={handleEventCreated} /> */}
                    <form onSubmit={handleSubmit} className="event-form">
                        <div className="form-group">
                            <label htmlFor="nombre_evento">Nombre del Evento</label>
                            <input
                                type="text"
                                id="nombre_evento"
                                name="nombre_evento"
                                value={formData.nombre_evento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lugar_evento">Lugar del Evento</label>
                            <input
                                type="text"
                                id="lugar_evento"
                                name="lugar_evento"
                                value={formData.lugar_evento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aforo_evento">Aforo del Evento</label>
                            <input
                                type="number"
                                id="aforo_evento"
                                name="aforo_evento"
                                value={formData.aforo_evento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipo_evento">Tipo de Evento</label>
                            <input
                                type="text"
                                id="tipo_evento"
                                name="tipo_evento"
                                value={formData.tipo_evento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rubro_negocio">Rubro del negocio</label>
                            <input
                                type="text"
                                id="rubro_negocio"
                                name="rubro_negocio"
                                value={formData.rubro_negocio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hora_inicio">Hora de Inicio</label>
                            <input
                                type="time"
                                id="hora_inicio"
                                name="hora_inicio"
                                value={formData.hora_inicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hora_culminacion">Hora de Culminación</label>
                            <input
                                type="time"
                                id="hora_culminacion"
                                name="hora_culminacion"
                                value={formData.hora_culminacion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_inicio">Fecha de Inicio</label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_finalizacion">Fecha de Finalización</label>
                            <input
                                type="date"
                                id="fecha_finalizacion"
                                name="fecha_finalizacion"
                                value={formData.fecha_finalizacion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button className='form-group' type="submit">Crear Evento</button>
                    </form>
                    <Button onClick={handleCloseForm}>Cerrar</Button>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;
