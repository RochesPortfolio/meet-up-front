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
import { ApiPort } from '../api/ApiPort';

const { Text } = Typography;
const { SHOW_PARENT } = TreeSelect;

const Guest = () => {
    // const treeData = [
    //     {
    //       title: 'Empresa 1',
    //       value: 'empresa1',
    //       children: [
    //         {
    //           title: 'Empleado 1',
    //           value: 'empresa1-empleado1',
    //         },
    //         {
    //           title: 'Empleado 2',
    //           value: 'empresa1-empleado2',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Empresa 2',
    //       value: 'empresa2',
    //       children: [
    //         {
    //           title: 'Empleado 3',
    //           value: 'empresa2-empleado3',
    //         },
    //         {
    //           title: 'Empleado 4',
    //           value: 'empresa2-empleado4',
    //         },
    //       ],
    //     },
    //   ];
    const [treeData, setTreeData] = useState([]);
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
    const [formData, setFormData] = useState({});

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${ApiPort}/api/events`);
            const {data} = await res.json();
            console.log(data, 'data')
            const eventList = data.map((event) => ({
                title: event.nombre_evento,
                key: event.hash_evento
            }));
            console.log(eventList)
            setEvents(eventList);
            setAllEventData(data); 
        } catch (error) {
            console.error("Error al obtener lista de eventos:", error);
            setLoading(false)
        }
    }

    const fetchGuest = async () => {
        try {
            const res = await fetch(`${ApiPort}/api/invites`);
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

    const fetchEnterprisesWithPersons = async () => {
        try {
            const res = await fetch(`${ApiPort}/api/getEnterprisesWithPersons`);
            const data = await res.json();

            const formattedData = data.data.map((enterprise) => ({
                title: enterprise.Empresa.nombre,
                value: enterprise.Empresa.id_empresa.toString(),
                children: enterprise.Empresa.Personas.map((person) => ({
                    title: `${person.nombres} ${person.apellidos}`,
                    value: person.correo
                }))
            }))
            console.log(formattedData)
            setTreeData(formattedData);
        } catch (error) {
            console.error("Error al obtener la lista de Empresas: ", error);
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
        console.log(allEventData)
        const selectedEvent = allEventData.find(event => event.nombre_evento === value);
        if(selectedEvent != null) {
            selectedEvent.fecha_inicio = dayjs(selectedEvent.fecha_inicio).format('DD/MM/YYYY');
            selectedEvent.hora_inicio = formatTime(selectedEvent.hora_inicio);
            selectedEvent.hora_culminacion = formatTime(selectedEvent.hora_culminacion);
            setSelectedEventDetails(selectedEvent);
        }
    }

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const handleTreeChange = async (newValue) => {
        let newSelectedValues = [...newValue];
        treeData.forEach((company) => {
            if(newSelectedValues.includes(company.value)) {
                const childrenValues = company.children.map((child) => child.value);
                newSelectedValues = [
                    ...newSelectedValues.filter(v => v !== company.value),
                    ...childrenValues
                ]
            }
        })
        setSelectedGuestValues(newSelectedValues);
        console.log(selectedGuestValues, 'seleccionados')
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
                        {events.map((event) => (
                            <Select.Option key={event.key} value={event.title}>{event.title}</Select.Option>
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
                        if (value !== undefined) {
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
        }
      ];

    const showModal = () => {
        fetchEnterprisesWithPersons();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setTreeData(null);
        setSelectedEventDetails(null);
        setIsModalVisible(false);
        setCurrentStep(0); 
        setSelectedGuestValues(null);
        form.resetFields();
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        form.setFieldValue(formData);
    };

    const nextStep = async () => {
        // form.validateFields().then(() => {
        //   setCurrentStep(currentStep + 1);
        // }).catch(() => {
        //   message.error('Por favor completa los campos antes de continuar');
        // });
        try {
            const values = await form.validateFields();
            console.log(values, 'valores');
            setFormData(prevData => ({...prevData, ...values}));
            setCurrentStep(currentStep +1);

            form.resetFields();
        } catch (error) {
            message.error('Por favor completa los campos antes de continuar');
        }
    };

    const handleCreate = async () => {    
        // form.validateFields().then((values) => {
        //     console.log(values)
        // }).catch(() => {
        //     message.error('Por favor completa los campos');
        // });
        try {
            console.log(selectedGuestValues, 'valores seleccionados')
            const values = await form.validateFields();
            console.log(values);
            const allData = {...formData, ...values, emails: {...selectedGuestValues}};
            console.log("Datos completos", allData);

            // const bodyData = Object.values(formData.emails).map((email) => ({
            //     from: "MeetUp Surveys",
            //     to: email,
            //     subject: formData.message,
            //     mailTemplateType: "survey",
            //     hash_evento: formData.event,
            // }));

            handleCancel();
        } catch (error) {
            message.error('Por favor completa los campos');
        }
      };

	return (
        <div style={{height: '100vh', marginTop: '20vh'}}>
            {loading ? (
                <div className="spin-container">
                    <Spin size="large" fullscreen/>
                </div>
            ) : (
                <div>         
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
                                            {events.map((event) => (
                                                <Select.Option key={event.key} value={event.title}>{event.title}</Select.Option>
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
                        <div>
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
