import React from 'react';

const EventDetails = ({ event }) => {
    return (
        <div>
            <strong>{event.title}</strong>
            <div>Lugar: {event.lugar_evento}</div>
            <div>Aforo: {event.aforo_evento}</div>
            <div>Tipo: {event.tipo_evento}</div>
            <div>Rubro: {event.rubro_negocio}</div>
            <div>Descripción: {event.description}</div>
        </div>
    );
};

export default EventDetails;
