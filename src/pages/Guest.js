// Filename - pages/about.js

import React, {useState} from "react";
import './Guest.css';
import { Select } from "antd";
import { Table, Card, Col, Row, Statistic, Tag, Button } from "antd";

const Guest = () => {
    const events = ['Evento A', 'Evento B', 'Evento C'];
    const states = ['Aceptado', 'Pendiente', 'Rechazado'];

    const [eventSelected, setEventSelected] = useState(undefined);
    const [stateSelected, setStateSelected] = useState('');

    const listGuest = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@example.com',
          telefono: '1234567890',
          genero: 'Masculino',
          empresa: 'Empresa A',
          negocio: 'Tecnología',
          fechaInvitacion: '2024-09-30',
          fechaConfirmacion: '2024-10-01',
          estadoInvitacion: 'Aceptado',
          evento: 'Evento A'
        },
        {
            nombre: 'María',
            apellido: 'López',
            correo: 'maria.gonzalez@example.com',
            telefono: '0987654321',
            genero: 'Femenino',
            empresa: 'Empresa B',
            negocio: 'Marketing',
            fechaInvitacion: '2024-09-29',
            fechaConfirmacion: '2024-10-02',
            estadoInvitacion: 'Pendiente',
            evento: 'Evento B'
        },
        {
          nombre: 'Sofía',
          apellido: 'González',
          correo: 'maria.gonzalez@example.com',
          telefono: '0987654321',
          genero: 'Femenino',
          empresa: 'Empresa B',
          negocio: 'Marketing',
          fechaInvitacion: '2024-09-29',
          fechaConfirmacion: '2024-10-02',
          estadoInvitacion: 'Rechazado',
          evento: 'Evento B'
        }
      ];

    const filterGuest = listGuest.filter(guest => {
        const event = eventSelected ? guest.evento === eventSelected: true;
        const state = stateSelected ? guest.estadoInvitacion === stateSelected : true;
            return event && state;
    })

    const uniqueCompanies = [...new Set(listGuest.map(guest => guest.empresa))];
    const uniqueBusiness = [...new Set(listGuest.map(business => business.negocio))];
    const uniqueState = [...new Set(listGuest.map(state => state.estadoInvitacion))];

    const accepted = filterGuest.filter(guest => guest.estadoInvitacion ===  'Aceptado').length;
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
                case 'Aceptado':
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
		<div>
			<h1>Asistentes por evento</h1>
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
                                    style={{width: 180}}
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
                        <Col span={3}>
                            <Card bordered={true}>
                                <Statistic
                                    title="Aceptados"
                                    value={accepted}
                                    precision={0}
                                    valueStyle={{
                                        color: '#3f8600',
                                    }}
                                    prefix=""
                                />
                            </Card>
                        </Col>
                        <Col span={3}>
                            <Card bordered={true}>
                                <Statistic
                                    title="Pendientes"
                                    value={pending}
                                    precision={0}
                                    valueStyle={{
                                        color: '#f0e512',
                                    }}
                                    prefix=""
                                />
                            </Card>
                        </Col>
                        <Col span={3}>
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
                    (eventSelected || stateSelected) == "" ? <h3></h3> :
                    <h3>No existe información</h3>
                )}
                </div>
            </div>
		</div>
	);
};

export default Guest;
