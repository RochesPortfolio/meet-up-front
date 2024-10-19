// Filename - pages/about.js

import React, {useEffect, useState} from "react";
import './Guest.css';
import { Select, Spin } from "antd";
import { Table, Card, Col, Row, Statistic, Tag, Button } from "antd";

const Guest = () => {
    const [events, setEvents] = useState([]);
    const [eventSelected, setEventSelected] = useState(undefined);
    const [stateSelected] = useState('');
    const [listGuest, setListGuest] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:3030/api/events');
            const data = await res.json();
            console.log(data);
            const eventList = data.map(event => event.nombre_evento);
            console.log(eventList)
            setEvents(eventList);
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false)
        }
    }

    const fetchGuest = async () => {
        try {
            const res = await fetch('http://localhost:3030/api/guests');
            const data = await res.json();
            console.log(data)
            const mappedData = data.map(guest => ({
                nombre: guest.id_persona.nombres,
                apellido: guest.id_persona.apellidos,
                correo: guest.id_persona.correo,
                telefono: guest.id_persona.telefono,
                genero: guest.id_persona.genero === 'M' ? 'Masculino' : 'Femenino',
                empresa: guest.id_empresa.nombre || 'Empresa Desconocida',
                negocio: guest.id_empresa.rubro_negocio,
                fechaInvitacion: guest.fecha_invitacion,
                fechaConfirmacion: guest.fecha_confirmacion || '-',
                estadoInvitacion: guest.estado_invitacion,
                evento: guest.id_evento.nombre_evento
            }));

            setListGuest(mappedData);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener lista de asistentes:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
        fetchGuest();
    }, []);

    const filterGuest = listGuest.filter(guest => {
        const event = eventSelected ? guest.evento === eventSelected: true;
        const state = stateSelected ? guest.estadoInvitacion === stateSelected : true;
            return event && state;
    })

    const uniqueCompanies = [...new Set(listGuest.map(guest => guest.empresa))];
    const uniqueBusiness = [...new Set(listGuest.map(business => business.negocio))];
    const uniqueState = [...new Set(listGuest.map(state => state.estadoInvitacion))];

    const accepted = filterGuest.filter(guest => guest.estadoInvitacion ===  'Confirmada').length;
    const pending = filterGuest.filter(guest => guest.estadoInvitacion ===  'Pendiente').length;
    const rejected = filterGuest.filter(guest => guest.estadoInvitacion ===  'Rechazado').length;

    const cleanSelection = () => {
        setEventSelected(undefined);  // Limpiar evento seleccionado
    };

    const columns = [
        {   title: 'Nombre', dataIndex: 'nombre', key: 'nombre',
            sorter: (a, b) => a.nombre.localeCompare(b.nombre)
         },
        {   title: 'Apellido', dataIndex: 'apellido', key: 'apellido',
            sorter: (a, b) => a.apellido.localeCompare(b.apellido)
         },
        { title: 'Correo', dataIndex: 'correo', key: 'correo' },
        { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
        { title: 'Género', dataIndex: 'genero', key: 'genero' },
        {
            title: 'Empresa',
            dataIndex: 'empresa',
            key: 'empresa',
            filters: uniqueCompanies.map(company => ({ text: company, value: company })),
            onFilter: (value, record) => record.empresa.includes(value),
        },
        {   title: 'Negocio', 
            dataIndex: 'negocio', 
            key: 'negocio', 
            filters: uniqueBusiness.map(business => ({ text: business, value: business })), 
            onFilter: (value, record) => record.negocio.includes(value) },
        {   title: 'Fecha Invitación', dataIndex: 'fechaInvitacion', key: 'fechaInvitacion',
            sorter: (a, b) => new Date(a.fechaInvitacion) - new Date(b.fechaInvitacion)
         },
        {   title: 'Fecha Confirmación', dataIndex: 'fechaConfirmacion', key: 'fechaConfirmacion',
            sorter: (a, b) => new Date(a.fechaConfirmacion) - new Date(b.fechaConfirmacion)
        },
        { 
            title: 'Estado Invitación',
            dataIndex: 'estadoInvitacion',
            key: 'estadoInvitacion',
            align: 'center',
            filters: uniqueState.map(state => ({ text: state, value: state })),
            onFilter: (value, record) => record.estadoInvitacion.includes(value),
            render: (estado) => {
              let color = '';
              switch (estado) {
                case 'Confirmada':
                  color = 'green';
                  break;
                case 'Pendiente':
                  color = 'yellow';
                  break;
                case 'Rechazado':
                  color = 'red';
                  break;
                default:
                  color = 'default';
              }
              return <Tag color={color}>{estado}</Tag>;
            }
        },
    ]

	return (
        <div className="home__section">
            {loading ? (
                <div className="spin-container">
                    <Spin size="large" fullscreen/>
                </div>
            ) : (
                <div className="home_container">         
                    <h1>Invitados por evento</h1>
                    <div className="tableContainer">
                        <table className="tableContent">
                            <thead>
                                <tr>
                                    <th>
                                        {/* Muestra asistentes filtrados por evento */}
                                        <div>
                                            <label htmlFor="event" className="labelContent">Selecciona un evento:</label>
                                            <Select 
                                            value={eventSelected}
                                            onChange={(value) => setEventSelected(value)}
                                            placeholder="-- Selecciona --"
                                            style={{width: 200}}
                                            >
                                            {events.map((event, index) => (
                                                <Select.Option key={index} value={event}>{event}</Select.Option>
                                            ))}
                                            </Select>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>      
                    <div style={{ marginTop: '20px' }}>
                        <Button onClick={cleanSelection}>Limpiar Selección</Button>
                    </div>      
                    <div>
                        <h2>Lista de Asistentes</h2>
                        <div className="rowContainer">
                            <Row gutter={16} className="rowContent">
                                <Col span={3} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="Confirmada"
                                            value={accepted}
                                            precision={0}
                                            valueStyle={{
                                                color: '#3f8600',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                                <Col span={3} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="Pendientes"
                                            value={pending}
                                            precision={0}
                                            valueStyle={{
                                                color: '#FFDF2B',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                                <Col span={3} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="Rechazados"
                                            value={rejected}
                                            precision={0}
                                            valueStyle={{
                                                color: '#cf1322',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div className="bodyContainer">
                        {filterGuest.length > 0 ? (
                            <Table dataSource={filterGuest} columns={columns} 
                            rowKey={(record, index) => index} />
                        ) : (
                            (eventSelected || stateSelected) === " " ? <h3></h3> :
                            <h3>No existe información</h3>
                        )}
                        </div>
                    </div>
                </div>
            )}
        </div>
	);
};

export default Guest;
