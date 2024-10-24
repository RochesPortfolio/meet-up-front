import React, { useState } from 'react';
import '../components/EventForm.css';
import  Calendar  from './Calendar.js';

const EventForm = ({ onEventCreated }) => {
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

  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);

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
        alert('Evento creado con éxito');
        onEventCreated(newEvent);
      } else {
        alert('Error al crear el evento');
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
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
    
  );
};

export default EventForm;