import React, {useEffect, useState} from "react";
import { ConfigProvider, Spin } from "antd";
import { Table, Card, Col, Row, Statistic, Button, DatePicker, Tag, Modal, Select, Input, InputNumber, message, Form } from "antd";
import { Header } from "antd/es/layout/layout";
import { ApiPort } from '../api/ApiPort';
import dayjs from "dayjs";
import 'dayjs/locale/es';

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
    // const [costList, setCostList] = useState([]);
    // const [costListSaved, setCostListSaved] = useState([]);
    const [eventStatus, setEventStatus] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [existingCosts, setExistingCosts] = useState([]);
    const [newCosts, setNewCosts] = useState([]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${ApiPort}/api/events`);
            const data = await res.json();
            
            setEvents(data.data);
            setFilteredEvents(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false)
        }
    }


    const fetchCost = async (eventID) => {
        try {
            fetch(`${ApiPort}/api/cost/${eventID}`)
            .then(response => response.json())
            .then(data => {
                const transData = data.map(item => ({
                    key: item.id_gasto.toString(),
                    nombre: '',
                    evento: eventID,
                    total: parseFloat(item.total),
                    descuento: parseFloat(item.descuento),
                    estado: item.estado_pago,
                    descripcion: item.comentarios
                }));
                const sum = transData.reduce((acc, cost) => acc + cost.total, 0);
                setExistingCosts(transData);
                calculateTotalSum(transData, newCosts);
                // setTotalCost(sum);
            });
        } catch (error) {
            console.error("Error al obtener el listado de costos: ", error);
            setLoading(false);
        }
    }

    const calculateTotalSum = (existing, newC) => {
        const existingTotal = existing.reduce((acc, cost) => acc + cost.total, 0);
        const newTotal = newC.reduce((acc, cost) => acc + (parseFloat(cost.total) || 0), 0);
        setTotalCost(existingTotal + newTotal);
      };

    useEffect(() => {
        fetchEvents();
    }, []);

    const uniqueState = [...new Set(events.map(event => event.status))];
    const uniqueCategory = [...new Set(events.map(event => event.tipo_evento))];

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
        fetchCost(event.id_evento);
        setEventStatus(event.status);
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    const closeEditModal = () => {
        setIsModalVisible(false);
        setEventStatus(null);
        setSelectedEvent(undefined);
        // setCostList([]);
        setNewCosts([]);
        setTotalCost(0);
        setExistingCosts([]);
        form.resetFields();
    };

    const columns = [
        {   title: 'Nombre', dataIndex: 'nombre_evento', key: 'nombre_evento',
            sorter: (a, b) => a.nombre_evento.localeCompare(b.nombre_evento)
        },
        { title: 'Categoría', dataIndex: 'tipo_evento', key: 'tipo_evento',
            align: 'center',
            filters: uniqueCategory.map(category => ({text: category, value: category})),
            onFilter: (value, record) => { return record.tipo_evento.includes(value) },
         },
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
                return record.status.includes(value)
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
                    key: `new-${Date.now()}`,
                    nombre: values.nombre,
                    evento: selectedEvent.id_evento,
                    total: values.total,
                    descuento: values.descuento || 0,
                    estado: values.estado,
                    descripcion: values.descripcion || ''
                };
                setNewCosts([...newCosts, newCost]);
                const newTotal = totalCost + values.total;
                setTotalCost(newTotal);
                form.resetFields(['nombre', 'total', 'descuento', 'estado', 'descripcion']);
                message.success("Costo agregado correctamente.");
            })
            .catch(() => {
                message.error("Por favor completa los campos requeridos.");
            });
    };

    const handleNewCostChange = (index, field, value) => {
        const updatedNewCosts = newCosts.map((cost, idx) => (
          idx === index ? { ...cost, [field]: value } : cost
        ));
        setNewCosts(updatedNewCosts);
    };

    const handleSave = async () => {
        if (newCosts.length === 0 && eventStatus === 'Finalizado') {
            message.error("No hay costos para guardar");
            return;
        }

        const data = {
            id_evento: selectedEvent.id_evento,
            status_evento: eventStatus,
            costos: newCosts.length > 0 ? newCosts.map(cost => ({
                evento: selectedEvent.id_evento,
                total: cost ? cost.total : '',
                descuento: cost ? cost.descuento : '',
                estado: cost.estado,
                descripcion: cost ? cost.descripcion : ''
            })) : []
        };
        const hideLoading = message.loading({ content: 'Espere un momento...', duration: 0 });
        try {
            const response = await fetch(`${ApiPort}/api/cost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.httpStatus === 200) {
                hideLoading();
                fetchEvents();
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

    const dataSource = [
        ...existingCosts,
        ...newCosts
    ]

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
                                            title="Pendiente"
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
                                <Select placeholder="Selecciona" onChange={handleStatusChange} disabled={eventStatus === 'Finalizado'}>
                                    <Option value="Pendiente">Pendiente</Option>
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
                {dataSource.length > 0 && (
                    <>
                        <div>
                            <Table
                                dataSource={dataSource}
                                columns={costColumns}
                                rowKey="key"
                                style={{ marginTop: 20 }}
                                pagination={{ pageSize: 5 }}
                            />
                            <p style={{fontWeight: 'bold', fontSize: '18px'}}>Total: Q{totalCost.toFixed(2)} </p>
                        </div>
                        <div>
                        </div>
                    </>
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
