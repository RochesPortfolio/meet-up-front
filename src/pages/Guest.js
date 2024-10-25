// Filename - pages/about.js

import React, {useEffect, useState} from "react";
import './Guest.css';
import { Form, Input, message, Modal, Select, Spin, Steps, TreeSelect, Typography } from "antd";
import { Table, Card, Col, Row, Statistic, Tag, Button } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Step } from "@material-ui/core";
import { Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import dayjs from 'dayjs';

const { Text } = Typography;
const {Option} = Select;
const { SHOW_PARENT } = TreeSelect;

const Guest = () => {
    const treeData = [
        {
          title: 'Empresa 1',
          value: 'empresa1',
          children: [
            {
              title: 'Empleado 1',
              value: 'empresa1-empleado1',
            },
            {
              title: 'Empleado 2',
              value: 'empresa1-empleado2',
            },
          ],
        },
        {
          title: 'Empresa 2',
          value: 'empresa2',
          children: [
            {
              title: 'Empleado 3',
              value: 'empresa2-empleado3',
            },
            {
              title: 'Empleado 4',
              value: 'empresa2-empleado4',
            },
          ],
        },
      ];
    const [selectedGuestValues, setSelectedGuestValues] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventSelected, setEventSelected] = useState(undefined);
    const [allEventData, setAllEventData] = useState([]);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);
    const [eventInviteSelected, setEventInviteSelected] = useState(undefined);
    const [stateSelected] = useState('');
    const [listGuest, setListGuest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:3030/api/events');
            const {data} = await res.json();
            const eventList = data.map(event => {
                return event.nombre_evento;
            });
            setEvents(eventList);
            setAllEventData(data); 
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false)
        }
    }

    const fetchGuest = async () => {
        try {
            const res = await fetch('http://localhost:3030/api/invites');
            const data = await res.json();
            const mappedData = data.map(guest => {

                return {
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
                }
            });

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
    const rejected = filterGuest.filter(guest => guest.estadoInvitacion ===  'Declinada').length;

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
                case 'Declinada':
                  color = 'red';
                  break;
                default:
                  color = 'default';
              }
              return <Tag color={color}>{estado}</Tag>;
            }
        },
    ]

    const handleEventSelect = (value) => {
        setEventInviteSelected(value);
        const selectedEvent = allEventData.find(event => event.nombre_evento === value);
        console.log(selectedEvent, 'evento seleccionado')
        if(selectedEvent != null) {
            selectedEvent.fecha_inicio = dayjs(selectedEvent.fecha_inicio).format('DD/MM/YYYY');
            selectedEvent.hora_inicio = formatTime(selectedEvent.hora_inicio);
            selectedEvent.hora_culminacion = formatTime(selectedEvent.hora_culminacion);
            setSelectedEventDetails(selectedEvent);
            console.log(selectedEventDetails, 'detalle')
        }
    }

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const handleTreeChange = (newValue) => {
        setSelectedGuestValues(newValue);
    };

    const steps = [
        {
          title: 'Detalles',
          content: (
            <>
                <Form.Item
                    name="title"
                    label="Título"
                    style={{fontSize: '20px'}}
                    rules={[{ required: true, message: '' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="event"
                    label="Evento"
                    rules={[{ required: true, message: '' }]}
                >   
                    <Select 
                        value={eventInviteSelected}
                        onChange={handleEventSelect}
                    >
                        {events.map((event, index) => (
                            <Select.Option key={index} value={event}>{event}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <div style={{marginTop: '8px', marginBottom: '8px'}}>
                    <Text style={{color: 'rgba(0, 0, 0, 0.88)'}}>Fecha </Text>
                </div>
                <div style={{marginTop: '8px', marginBottom: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                        <FontAwesomeIcon style={{fontSize: '16px', marginRight: '8px', color: '#235789'}} icon={faCalendar} />
                        <Input style={{marginRight: '16px', width: '100px', fontWeight: 'bold'}} disabled 
                         value={selectedEventDetails ? selectedEventDetails.fecha_inicio : '-'}></Input>
                        <FontAwesomeIcon style={{fontSize: '16px', marginRight: '8px', color: '#235789'}} icon={faClock} />
                        <Input style={{width: '110px', fontWeight: 'bold'}} disabled 
                         value={selectedEventDetails ? selectedEventDetails.hora_inicio + ' - ' + selectedEventDetails.hora_culminacion : '-' }></Input>
                    </div>
                </div>
                <div style={{marginTop: '8px', marginBottom: '8px'}}>
                    <Text style={{color: 'rgba(0, 0, 0, 0.88)'}}>Lugar </Text>
                </div>
                <div style={{marginTop: '8px', marginBottom: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                        <Input style={{fontWeight: 'bold'}} disabled 
                         value={selectedEventDetails ? selectedEventDetails.lugar_evento : ' '}></Input>
                    </div>
                </div>
                
            </>
            
          ),
        },
        {
          title: 'Invitados',
          content: (
            <>
                <Form.Item
                    name="employee"
                    label="Invitados"
                    rules={[{ required: true, message: '', validator: (_, value) => {
                        if (value != undefined) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Selecciona al menos un invitado'));
                    }
                     }]}
                    >
                    <TreeSelect
                        treeData={treeData}
                        value={selectedGuestValues}  
                        onChange={handleTreeChange}  
                        treeCheckable={true}  
                        showCheckedStrategy={SHOW_PARENT} 
                    />
                </Form.Item>
                <Form.Item
                    name="message"
                    label="Mensaje"    
                >
                    <TextArea placeholder="Escribe los detalles para esta nueva invitación" autoSize={{ minRows: 3, maxRows: 8 }}>
                    </TextArea>
                </Form.Item>
            </>
          ),
        },
        // {
        //   title: 'Paso 3',
        //   content: (
        //     <Form.Item
        //       name="input2"
        //       label="Input 2"
        //       rules={[{ required: true, message: 'Por favor ingresa el Input 2' }]}
        //     >
        //       <Input />
        //     </Form.Item>
        //   ),
        // },
      ];

    const showModal = () => {
       setIsModalVisible(true);
    };

    const handleCancel = () => {
        setSelectedEventDetails(null);
        setIsModalVisible(false);
        setCurrentStep(0); 
        form.resetFields();
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const nextStep = () => {
        form.validateFields().then(() => {
          setCurrentStep(currentStep + 1);
        }).catch(() => {
          message.error('Por favor completa los campos antes de continuar');
        });
    };

    const handleCreate = () => {
        
        form.validateFields().then((values) => {
            //enviar datos del formulario
        }).catch(() => {
            message.error('Por favor completa los campos');
        });
      };

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
                        <h2>Lista de Invitaciones</h2>
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
                                            title="Declinadas"
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
                            <div className="buttonContainer">
                                <Button type="primary" onClick={showModal} iconPosition="end" icon={<FontAwesomeIcon icon={faPlus} />}>
                                    Nueva Invitación
                                </Button>
                            </div>
                            <div>
                                {filterGuest.length > 0 ? (
                                    <Table dataSource={filterGuest} columns={columns} 
                                    rowKey={(record, index) => index} />
                                ) : (
                                    (eventSelected) === " " ? <h3></h3> :
                                    <h3>No existe información</h3>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal 
                title={"Crear invitación"}
                width={800}
                bodyStyle={{height: '500px', overflowY: 'auto', padding: '0 50px'}}
                centered
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    currentStep > 0 && (
                        <Button key="back" onClick={prevStep}>
                            Atrás
                        </Button>
                    ),
                    currentStep < steps.length - 1 && (
                        <Button key="next" type="primary" onClick={nextStep}>
                            Siguiente
                        </Button>
                    ),
                    currentStep === steps.length - 1 && (
                        <Button key="create" type="primary" onClick={handleCreate}>
                            Enviar
                        </Button>
                    )
                ]}
            >
                <Header style={{background: 'white', display: 'flex', alignItems: 'center', marginTop: '20px', 'marginBottom': '10px'}}>
                    <Steps current={currentStep}>
                        {steps.map((item, index) => (
                            <Step key={index} title={item.title}/>
                        ))}
                    </Steps>
                </Header>
                <Form form={form} layout="vertical">
                    {steps[currentStep].content}
                </Form>
            </Modal>
        </div>
	);
};

export default Guest;
