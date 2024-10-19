// Filename - pages/about.js

import React, {useEffect, useState} from "react";
import { ConfigProvider, Spin } from "antd";
import { Table, Card, Col, Row, Statistic, Button, DatePicker } from "antd";
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
            const res = await fetch('http://localhost:3030/api/events');
            const data = await res.json();
            setEvents(data);
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

    const uniqueState = [...new Set(events.map(event => event.state))];

    const planned = events.filter(event => event.status ===  1).length;
    const inProgress = events.filter(event => event.status === 2).length;
    const finished = events.filter(event => event.status ===  3).length;

    const handleDateChange = (dates) => {
        if (dates) {
            setSelectedDates(dates);
            const [startDate, endDate] = dates;
        
            const filtered = events.filter(event => {
                const eventDate = new Date(event.fecha_inicio);
                return eventDate >= startDate && eventDate <= endDate;
            });
        
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
        // { 
        //     title: 'Estado',
        //     dataIndex: 'estado',
        //     key: 'estado',
        //     align: 'center',
        //     filters: uniqueState.map(state => ({ text: state, value: state })),
        //     onFilter: (value, record) => record.estado.includes(value),
        //     render: (estado) => {
        //       let color = '';
        //       switch (estado) {
        //         case 'Confirmada':
        //           color = 'green';
        //           break;
        //         case 'Pendiente':
        //           color = 'yellow';
        //           break;
        //         case 'Rechazado':
        //           color = 'red';
        //           break;
        //         default:
        //           color = 'default';
        //       }
        //       return <Tag color={color}>{estado}</Tag>;
        //     }
        // },
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

export default Event;
