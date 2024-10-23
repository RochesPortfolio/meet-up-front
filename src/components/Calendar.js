import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/Calendar.css';
import { Table, Card, Col, Row, Statistic, Tag, Button } from "antd";
import { Form, Input, message, Modal, Select, Spin, Steps, TreeSelect, Typography } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventForm from './EventForm';
import '../components/EventForm.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

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

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                style={{ height: 500 }}
            />
            {showForm && (
                <div className="form-popup">
                    <EventForm onEventCreated={handleEventCreated} />
                    <Button onClick={handleCloseForm}>Cerrar</Button>
                </div>
            )}
            {/* <button onClick={() => alert('Agregar evento')}>Agregar Evento</button> */}
        </div>
    );
};

export default MyCalendar;
