import React, {useEffect, useState} from "react";
import { ConfigProvider, Spin } from "antd";
import { Table, Card, Col, Row, Statistic, Button, DatePicker, Tag, Modal, Select, Input, InputNumber, message, Form } from "antd";
import { Header } from "antd/es/layout/layout";
import { ApiPort } from '../api/ApiPort';
import dayjs from "dayjs";
import 'dayjs/locale/es'
const { RangePicker } = DatePicker;
dayjs.locale('es');

const { Option } = Select;

const Event = () => {
    const [selectedDates, setSelectedDates] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [form] = Form.useForm();
    const [costList, setCostList] = useState([]);
    const [eventStatus, setEventStatus] = useState('');

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:3030/api/events');
            const data = await res.json();
            // const data = {
            //     "data": [
            //         {
            //             "id_evento": 12,
            //             "hash_evento": "06f9a5c8-97c0-4908-8bda-7d718dc83f2b",
            //             "nombre_evento": "E-commerce Summit",
            //             "lugar_evento": "Chicago, IL",
            //             "aforo_evento": 200,
            //             "tipo_evento": "Cumbre",
            //             "descripcion": "Una cumbre sobre comercio electrónico.",
            //             "rubro_negocio": "E-commerce",
            //             "hora_inicio": "08:00:00",
            //             "hora_culminacion": "12:00:00",
            //             "fecha_inicio": "2024-09-20",
            //             "fecha_finalizacion": "2024-09-20",
            //             "fecha_creacion": "2024-10-23T12:25:40.876Z",
            //             "fecha_actualizacion": "2024-10-23T12:25:40.876Z",
            //             "status": "Finalizado"
            //         },
            //         {
            //             "id_evento": 10,
            //             "hash_evento": "386712d8-7845-4141-bbbb-c0af3a72334a",
            //             "nombre_evento": "AI Summit",
            //             "lugar_evento": "San Francisco, CA",
            //             "aforo_evento": 500,
            //             "tipo_evento": "Conferencia",
            //             "descripcion": "Una conferencia sobre inteligencia artificial.",
            //             "rubro_negocio": "Tecnología",
            //             "hora_inicio": "09:00:00",
            //             "hora_culminacion": "17:00:00",
            //             "fecha_inicio": "2024-09-05",
            //             "fecha_finalizacion": "2024-09-05",
            //             "fecha_creacion": "2024-10-23T12:25:14.851Z",
            //             "fecha_actualizacion": "2024-10-23T12:25:14.851Z",
            //             "status": "Finalizado"
            //         },
            //         {
            //             "id_evento": 11,
            //             "hash_evento": "56fcbbe1-d5e1-4fda-abb8-05edcf46909f",
            //             "nombre_evento": "Blockchain Expo",
            //             "lugar_evento": "New York, NY",
            //             "aforo_evento": 300,
            //             "tipo_evento": "Exposición",
            //             "descripcion": "Una exposición sobre tecnología blockchain.",
            //             "rubro_negocio": "Tecnología",
            //             "hora_inicio": "10:00:00",
            //             "hora_culminacion": "16:00:00",
            //             "fecha_inicio": "2024-09-10",
            //             "fecha_finalizacion": "2024-09-10",
            //             "fecha_creacion": "2024-10-23T12:25:33.877Z",
            //             "fecha_actualizacion": "2024-10-23T12:25:33.877Z",
            //             "status": "Finalizado"
            //         }
            //     ],
            //     "success": true,
            //     "message": "Events by month and year",
            //     "httpStatus": 200
            // }
            setEvents(data.data);
            setFilteredEvents(data.data);
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
    const inProgress = events.filter(event => event.status === "En curso").length;
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

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    const closeEditModal = () => {
        setIsModalVisible(false);
        setEventStatus(null);
        setSelectedEvent(undefined);
        setCostList([]);
        form.resetFields();
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
        { 
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            filters: uniqueState.map(state => ({ text: state, value: state })),
            onFilter: (value, record) => {
                return record.estado.includes(value)
            },
            render: (estado) => {
              let color = '';
              switch (estado) {
                case 'Pendiente':
                  color = 'green';
                  break;
                case 'En curso':
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
        { title: 'Acción', key: 'accion', render: (text, record) => (
            <Button onClick={() => openEditModal(record)}>Editar</Button>
        )},
    ]

    const costColumns = [
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Evento', dataIndex: 'evento', key: 'evento' },
        { title: 'Total', dataIndex: 'total', key: 'total' },
        { title: 'Descuento', dataIndex: 'descuento', key: 'descuento' },
        { title: 'Estado', dataIndex: 'estado', key: 'estado' },
        { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' }
    ];

    const handleStatusChange = (value) => {
        setEventStatus(value);
    };

    const handleAddCost = () => {
        form.validateFields()
            .then(values => {
                const newCost = {
                    nombre: values.nombre,
                    evento: selectedEvent.nombre_evento,
                    total: values.total,
                    descuento: values.descuento || 0,
                    estado: values.estado,
                    descripcion: values.descripcion || ''
                };
                setCostList([...costList, newCost]);
                console.log(...costList)
                form.resetFields(['nombre', 'total', 'descuento', 'estado', 'descripcion']);
                message.success("Costo agregado correctamente.");
            })
            .catch(() => {
                message.error("Por favor completa los campos requeridos.");
            });
    };

    const handleSave = async () => {
        if (costList.length === 0) {
            message.error("No hay costos para guardar");
            return;
        }

        const data = {
            costos: costList.map(cost => ({
                evento: selectedEvent.nombre_evento,
                total: cost.total,
                descuento: cost.descuento,
                estado: cost.estado,
                descripcion: cost.descripcion
            }))
        };
        console.log(data, 'data')
        const hideLoading = message.loading({ content: 'Espere un momento...', duration: 0 });
        try {
            const response = await fetch(`${ApiPort}/api/invite/sendInvite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            });

            const result = await response.json();

            if (response.ok && result.httpStatus === 200) {
                hideLoading();
                message.success("Datos guardados correctamente.");
            } else {
                hideLoading();
                message.error('Ha ocurrido un error, por favor intenta más tarde');
            }
            
            closeEditModal();
        } catch (error) {
            hideLoading();
            message.error("Ha ocurrido un error, por favor intenta más tarde.");
        }
    };

	return (
        <div style={{height: '100vh', marginTop: '20vh', width: '100vw'}}>
            {loading ? (
                <div className="spin-container">
                    <Spin size="large" fullscreen/>
                </div>
            ) : (
                <div>         
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
                        <div>
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
                            <Table style={{width: '85vw'}} dataSource={filteredEvents} columns={columns} 
                            rowKey={(record, index) => index} />
                        ) : (
                            // (monthSelected) === " " ? <h3></h3> :
                            <h3>No existe información</h3>
                        )}
                        </div>
                    </div>
                </div>
            )}
            <Modal  
                title={"Editar evento"} 
                width={1100}
                bodyStyle={{height: '550px', overflowY: 'auto', padding: '0 50px'}}
                visible={isModalVisible} 
                onCancel={closeEditModal}
                footer={[
                    <Button key="cancel" onClick={closeEditModal}>
                        Cancelar
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                ]}
            >
                <div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <p style={{fontWeight: 'bold', fontSize: '18px'}}>{selectedEvent ? selectedEvent.nombre_evento : ''}</p>
                    </div>
                    <div>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{ estadoEvento: eventStatus }}
                        >
                            <Form.Item
                                name="estadoEvento"
                                label="Estado del Evento"
                                rules={[{ required: true, message: 'Por favor selecciona el estado del evento' }]}
                            >
                                <Select placeholder="Selecciona" onChange={handleStatusChange}>
                                    <Option value="Planificado">Planificado</Option>
                                    <Option value="En curso">En curso</Option>
                                    <Option value="Finalizado">Finalizado</Option>
                                </Select>
                            </Form.Item>

                            {eventStatus === 'Finalizado' && (
                                <>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="nombre"
                                                label="Tipo de Costo"
                                                rules={[{ required: eventStatus === 'Finalizado', message: 'Este campo es obligatorio' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="total"
                                                label="Monto Total"
                                                rules={[{ type: 'number', required: eventStatus === 'Finalizado', message: 'Este campo es obligatorio' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="descuento"
                                                label="Descuento"
                                                rules={[
                                                    { type: 'number', message: '' }
                                                ]}
                                            >
                                                <InputNumber placeholder="(opcional)" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                name="estado"
                                                label="Estado del Costo"
                                                rules={[{ required: eventStatus === 'Finalizado', message: 'Este campo es obligatorio' }]}
                                            >
                                                <Select>
                                                    <Option value="Pagado">Pagado</Option>
                                                    <Option value="Pendiente">Pendiente</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name="descripcion"
                                        label="Descripción o Notas"
                                    >
                                        <Input placeholder="Ingresa una descripción (opcional)" />
                                    </Form.Item>

                                    <Button type="primary" onClick={handleAddCost}>Agregar Costo</Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
                {costList.length > 0 && (
                    <div>
                        <Table
                            dataSource={costList}
                            columns={costColumns}
                            rowKey={(record, index) => index}
                            style={{ marginTop: 20 }}
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                )}
            </Modal>
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
