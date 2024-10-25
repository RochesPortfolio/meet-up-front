import React, {useEffect, useState} from "react";
import { ConfigProvider, Spin } from "antd";
import { Table, Card, Col, Row, Statistic, Button, DatePicker, Tag } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/es'
const { RangePicker } = DatePicker;
dayjs.locale('es');

const Event = () => {
    const [selectedDates, setSelectedDates] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState(events);

    const fetchEvents = async () => {
        try {
            // const res = await fetch('http://localhost:3030/api/events');
            // const data = await res.json();
            const data = {
                "data": [
                    {
                        "id_evento": 12,
                        "hash_evento": "06f9a5c8-97c0-4908-8bda-7d718dc83f2b",
                        "nombre_evento": "E-commerce Summit",
                        "lugar_evento": "Chicago, IL",
                        "aforo_evento": 200,
                        "tipo_evento": "Cumbre",
                        "descripcion": "Una cumbre sobre comercio electrónico.",
                        "rubro_negocio": "E-commerce",
                        "hora_inicio": "08:00:00",
                        "hora_culminacion": "12:00:00",
                        "fecha_inicio": "2024-09-20",
                        "fecha_finalizacion": "2024-09-20",
                        "fecha_creacion": "2024-10-23T12:25:40.876Z",
                        "fecha_actualizacion": "2024-10-23T12:25:40.876Z",
                        "status": "Finalizado"
                    },
                    {
                        "id_evento": 10,
                        "hash_evento": "386712d8-7845-4141-bbbb-c0af3a72334a",
                        "nombre_evento": "AI Summit",
                        "lugar_evento": "San Francisco, CA",
                        "aforo_evento": 500,
                        "tipo_evento": "Conferencia",
                        "descripcion": "Una conferencia sobre inteligencia artificial.",
                        "rubro_negocio": "Tecnología",
                        "hora_inicio": "09:00:00",
                        "hora_culminacion": "17:00:00",
                        "fecha_inicio": "2024-09-05",
                        "fecha_finalizacion": "2024-09-05",
                        "fecha_creacion": "2024-10-23T12:25:14.851Z",
                        "fecha_actualizacion": "2024-10-23T12:25:14.851Z",
                        "status": "Finalizado"
                    },
                    {
                        "id_evento": 11,
                        "hash_evento": "56fcbbe1-d5e1-4fda-abb8-05edcf46909f",
                        "nombre_evento": "Blockchain Expo",
                        "lugar_evento": "New York, NY",
                        "aforo_evento": 300,
                        "tipo_evento": "Exposición",
                        "descripcion": "Una exposición sobre tecnología blockchain.",
                        "rubro_negocio": "Tecnología",
                        "hora_inicio": "10:00:00",
                        "hora_culminacion": "16:00:00",
                        "fecha_inicio": "2024-09-10",
                        "fecha_finalizacion": "2024-09-10",
                        "fecha_creacion": "2024-10-23T12:25:33.877Z",
                        "fecha_actualizacion": "2024-10-23T12:25:33.877Z",
                        "status": "Finalizado"
                    }
                ],
                "success": true,
                "message": "Events by month and year",
                "httpStatus": 200
            }
            setEvents(data.data);
            setFilteredEvents(data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const uniqueState = [...new Set(events.map(event => event.status))];

    const planned = events.filter(event => event.status ===  "Pendiente").length;
    const inProgress = events.filter(event => event.status === "En progreso").length;
    const finished = events.filter(event => event.status ===  "Finalizado").length;

    const handleDateChange = (dates) => {
        if (dates) {
            setSelectedDates(dates);
            const startDate = new Date(dates[0].format("YYYY-MM-DD"));
            const endDate = new Date(dates[1].format("YYYY-MM-DD")); 

            const filtered = events.filter(event => {
                const eventDate = new Date(event.fecha_inicio);
                return eventDate >= startDate && eventDate <= endDate;
            });
            console.log(filtered);
            setFilteredEvents(filtered);
        } else {
          setFilteredEvents(events);
        }
    };

    const handleClearDates = () => {
        fetchEvents();
        setSelectedDates(null);
    };

    const columns = [
        {   title: 'Nombre', dataIndex: 'nombre_evento', key: 'nombre_evento',
            sorter: (a, b) => a.nombre_evento.localeCompare(b.nombre_evento)
        },
        { title: 'Categoría', dataIndex: 'tipo_evento', key: 'tipo_evento' },
        { title: 'Detalle', dataIndex: 'descripcion', key: 'descripcion' },
        { title: 'Ubicación', dataIndex: 'lugar_evento', key: 'lugar_evento' },
        {   title: 'Fecha', dataIndex: 'fecha_inicio', key: 'fecha_inicio',
            sorter: (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
         },
        { title: 'Hora', dataIndex: 'hora_inicio', key: 'hora_inicio' },
        { title: 'Invitados', dataIndex: 'aforo_evento', key: 'aforo_evento' },
        { title: 'Confirmados', dataIndex: 'confirmados', key: 'confirmados' },
        { title: 'Estado', dataIndex: 'state', key: 'state' },
        { 
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            filters: uniqueState.map(state => ({ text: state, value: state })),
            onFilter: (value, record) => record.estado.includes(value),
            render: (estado) => {
              let color = '';
              switch (estado) {
                case 'Pendiente':
                  color = 'green';
                  break;
                case 'En progreso':
                  color = 'yellow';
                  break;
                case 'Finalizado':
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
                    <h1>Eventos</h1>
                    <div className="tableContainer">
                        <table className="tableContent">
                            <thead>
                                <tr>
                                    <th>
                                        <div>
                                            <ConfigProvider locale={{locale: 'es'}}>
                                                <RangePicker value={selectedDates} onChange={handleDateChange} placeholder={['Desde', 'Hasta']}/>
                                            </ConfigProvider>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>      
                    <div style={{ marginTop: '20px' }}>
                        <Button onClick={handleClearDates}>Limpiar Selección</Button>
                    </div>      
                    <div>
                        <h2>Historial de Eventos</h2>
                        <div style={{width: '100%'}}>
                            <Row gutter={16} className="rowContent">
                                <Col span={4} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="Planificados"
                                            value={planned}
                                            precision={0}
                                            valueStyle={{
                                                color: '#0050F5',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                                <Col span={4} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="En curso"
                                            value={inProgress}
                                            precision={0}
                                            valueStyle={{
                                                color: '#FFDF2B',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                                <Col span={4} className="colContent">
                                    <Card bordered={true}>
                                        <Statistic
                                            title="Finalizados"
                                            value={finished}
                                            precision={0}
                                            valueStyle={{
                                                color: '#3f8600',
                                            }}
                                            prefix=""
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div className="bodyContainer">
                        {filteredEvents.length > 0 ? (
                            <Table dataSource={filteredEvents} columns={columns} 
                            rowKey={(record, index) => index} />
                        ) : (
                            // (monthSelected) === " " ? <h3></h3> :
                            <h3>No existe información</h3>
                        )}
                        </div>
                    </div>
                </div>
            )}
        </div>
	);
};

// import React, { useState } from 'react';
// import MyCalendar from '../components/Calendar.js';

// const Event = () => {

//     return (
//         <div>
//             <MyCalendar />
//         </div>
//     );
// };

export default Event;
