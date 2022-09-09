import './App.css';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"
import DataTable from 'react-data-table-component';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiExit } from "react-icons/bi";
import { BsFillPlusCircleFill, BsPhoneFill, BsFillPersonFill, BsFillPersonLinesFill, BsFillCloudFill  } from 'react-icons/bs';
import { FaCity } from "react-icons/fa";
import { GiStreetLight, GiDesk } from "react-icons/gi";
import { AiFillApi, AiOutlineNumber } from 'react-icons/ai';


function Home() {
  const [cookies, removeCookie] = useCookies(['auth']);
  let navigate = useNavigate();
  
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')));
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true); 
    setRecord(0); 
    console.log(record);
  };
  function handleModify(r){
    setRecord(r);
    setShow(true);
  }

  //Columnas de la tabla
  const columns = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      grow:-1,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      //grow:1,
    },
    {
      name: 'UserName',
      selector: row => row.username,
      //grow:1,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
      //grow:1,
    },
    {
      name: 'Website',
      selector: row => row.website,
      wrap:true,
    },
    {
      name: 'Address',
      selector: row => 
      row.address.street + ', ' + row.address.suite + ', ' +  row.address.zipcode + ', ' + row.address.city,
      //grow:1,
      wrap:true,
    },
    {
      name: 'Company',
      selector: row => row.company.name,
      sortable: true,
      //grow:1,
    },
    {
      name: 'Opciones',
      button: true,
      cell: (row) => 
        <Dropdown id='d-inline mx-2'>
          <Dropdown.Toggle id='dropdown-autoclose-true'>
            Opciones
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleModify(row)}>Modificar</Dropdown.Item>
            <Dropdown.Item onClick={() => eliminar(row)}>Eliminar</Dropdown.Item>
            <Dropdown.Item as={'button'}><a href={`https://www.google.com/maps/search/${row.address.geo.lat},${row.address.geo.lng}`} target={'_blank'} className='d-grid gap-2' style={{textDecoration:'none', color:'black'}}>Maps</a></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    },
  ];

  function eliminar(record) {
    const aux = data.filter((item) => item.id != record.id)
    setData(aux);
    localStorage.setItem('data',JSON.stringify(aux));
  }


  function modificarRegistro(event){
    const i = record.id;
    const aux = data.filter((item) => item.id != record.id)
    const ob1 ={
      city: event.target.city.value,
      street: event.target.street.value,
      suite: event.target.suite.value,
      zipcode: event.target.zipcode.value,
      geo: {
        lat:record.address.geo.lat,
        lng:record.address.geo.lng
      }
    }
    const ob2 = {
      name: event.target.company.value,
      catchPhrase: event.target.catchPhrase.value,
      bs: event.target.bs.value,
    }
    const ob3= {
      id: i, 
      name: event.target.name.value, 
      username: event.target.username.value,
      phone: event.target.phone.value,
      website: event.target.website.value,
      address: ob1,
      company: ob2,
    }
    const newData = [...aux, ob3];
    console.log(newData);
    localStorage.setItem('data', JSON.stringify(newData));
    setData(newData.reverse());
  }

  function add_record (id, name, username, phone, website, city, street, suite, zipcode, company, catchPhrase, bs) {
    console.log(name)
    const objAddress = {
      city: city,
      street: street,
      suite: suite,
      zipcode: zipcode,
      geo: {
        lat:0,
        lng:0
      }
    }
    const objCompany ={
      name: company,
      catchPhrase: catchPhrase,
      bs: bs
    }
    const obj = {
      id: id,
      name: name,
      username: username,
      phone: phone, 
      website: website,
      address: objAddress,
      company: objCompany,
    }
    const aux = [...data, obj];
    setData(aux);
    localStorage.setItem('data', JSON.stringify(aux));
    localStorage.setItem('count', parseInt(localStorage.getItem('count'))+1);
  }

  function handleSubmit (event){
    event.preventDefault()
    
    {record!=0 ? modificarRegistro(event)
      :add_record(
      parseInt(localStorage.getItem('count'))+1,
      event.target.name.value,
      event.target.username.value,
      event.target.phone.value,
      event.target.website.value,
      event.target.city.value,
      event.target.street.value,
      event.target.suite.value,
      event.target.zipcode.value,
      event.target.company.value,
      event.target.catchPhrase.value,
      event.target.bs.value,
    )}

    handleClose();
  }
  
  function logout(){
    removeCookie('auth');
    navigate('/login');
  }

  //El modal usado para añadir y modificar.
  function ModalCustom (show) {
    return(
    <Modal 
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
        animation={false}
        
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Modal.Header closeButton >
                <Modal.Title>{record!=0 ? 'Modificar Registro' :'Nuevo registro'}</Modal.Title>
              </Modal.Header>
            </Col>
          </Row>
          
          <Modal.Body>
              <Form.Group className="mb-3" controlId='name'>
                <Row>
                  <Col md={1}>
                    <BsFillPersonFill size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Nombre: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Nombre' name='name' defaultValue={record.name} disabled/>
                  :<Form.Control type='text' placeholder='Nombre'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='username'>
                <Row>
                  <Col md={1}>
                    <BsFillPersonLinesFill size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Nombre de usuario: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Nombre de usuario' defaultValue={record.username} disabled/>
                 : <Form.Control type='text' placeholder='Nombre de usuario'  minLength={8} maxLength={16} required/>}
              </Form.Group>
              <Form.Group className="mb-3" controlId='phone'>
                <Row>
                  <Col md={1}>
                    <BsPhoneFill size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Celular: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Celular' defaultValue={record.phone}/>
                : <Form.Control type='number' placeholder='Celular'  minLength={1000000000} maxLength={9999999999} required/>}
              </Form.Group>
              <Form.Group className="mb-3" controlId='website'>
                <Row>
                  <Col md={1}>
                    <BsFillCloudFill size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Website: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Website' defaultValue={record.website} disabled/>
                  : <Form.Control type='text' placeholder='Website'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='city'>
                <Row>
                  <Col md={1}>
                    <FaCity size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Ciudad: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Ciudad' defaultValue={record.address.city}/>
                  : <Form.Control type='text' placeholder='Ciudad'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='street'>
                <Row>
                  <Col md={1}>
                    <GiStreetLight size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Calle: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Calle' defaultValue={record.address.street}/>
                  : <Form.Control type='text' placeholder='Calle'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='suite'>
                <Row>
                  <Col md={1}>
                    <AiOutlineNumber size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Suite: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Suite' defaultValue={record.address.suite}/>
                  : <Form.Control type='text' placeholder='Suite'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='zipcode'>
                <Row>
                  <Col md={1}>
                   <AiOutlineNumber size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Codigo postal: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Codigo postal' defaultValue={record.address.zipcode}/>
                  : <Form.Control type='text' placeholder='Codigo postal' minLength={5} maxLength={5}/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='company'>
                <Row>
                  <Col md={1}>
                    <GiDesk size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Compañia: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Compañia' defaultValue={record.company.name} disabled/>
                  : <Form.Control type='text' placeholder='Compañia'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='bs'>
                <Row>
                  <Col md={1}>
                    <AiFillApi size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> BS: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Bs' defaultValue={record.company.bs} disabled/>
                  : <Form.Control type='text' placeholder='BS'/> }
              </Form.Group>
              <Form.Group className="mb-3" controlId='catchPhrase'>
                <Row>
                  <Col md={1}>
                    <AiFillApi size={30}/>
                  </Col>
                  <Col>
                    <Form.Label style={{marginTop:4}}> Catch Phrase: </Form.Label>
                  </Col>
                </Row>
                {record!=0 ? <Form.Control type='text' placeholder='Catch Phrase' defaultValue={record.company.catchPhrase} disabled/>
                  : <Form.Control type='text' placeholder='Catch Phrase'/> }
              </Form.Group>
            
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" type='button' onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type='submit'>
              Guardar
            </Button>

          </Modal.Footer>
        </Form>
      </Modal>

    );
  }

  if (!cookies.auth) {
    return navigate('/login');
  }
  return (
    <div className="App">

      {/*Modal form */}
      {show ? <ModalCustom show={show}/> : null }

      <div>
          {/*<button onClick={() => console.log(data)}>
            Aver?
          </button>*/}
          <h1 className='h1'>Home</h1>
        <Row>
          <Col>
            <Button onClick={handleShow} size='sm'>
              <BsFillPlusCircleFill size={40} className='d-flex align-self-right'/>
            </Button>
          </Col>

          <Col xs={10}>
          </Col>

          <Col>
            <Button onClick={logout} size='sm'>
              <BiExit size={40} className='d-flex align-self-right'/>
            </Button>
          </Col>
        </Row>
        {data ? 
          <DataTable 
            columns={columns} 
            data={data}
            pagination
          /> 
        : null}
      </div>
    </div>
  );
}

export default Home;