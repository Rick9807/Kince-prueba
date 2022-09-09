import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Alert } from "react-bootstrap";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"
import Home from "./Home";



function Login() {
    const [cookies, setCookie, removeCookie] = useCookies(['auth']);
    let navigate = useNavigate();

    //Llamada al endpoint
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/users")
          .then(res => res.json())
          .then((result) => localStorage.setItem('data',JSON.stringify(result.reverse())))
          .catch((e) => console.log("FALLO PERRO   " + e));
          localStorage.setItem('count', JSON.parse(localStorage.getItem('data')).length);
      },[])

    //Se hardcodea el usuario y contraseña
    function handleSubmit (e) {
        if (e.target.user.value === 'pruebatest' && e.target.pass.value === '123456qw_') {
            //alert('Si entra');
            setCookie('auth', true, {path: '/'});
            navigate('/');
            //localStorage.setItem('prueba', 120);
        }
        else{
            alert('Contraseña y/o usuario incorrectos');
        }
    }

    function prueba () {
        alert(cookies.auth);
        removeCookie('auth');
    }

    if (cookies.auth == true) {
        return (
            <>
                <h1>YA ESTAS LOGEADO</h1>
                <button onClick={() => navigate('/')}> Regresar </button>
            </>
        );
    }
    return(
        <>  
            <Container className="mt-5 bg-light" >
                <Row>
                    <div className="d-flex justify-content-center">
                        <h1>Login</h1>
                    </div>
                </Row>
                <Row>
                    <div className="d-flex justify-content-center">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="user">
                                <Form.Label>Usuario:</Form.Label>
                                <Form.Control 
                                    required 
                                    type="text" 
                                    placeholder="Ingresa el usuario"
                                    minLength={8}
                                    maxLength={16}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="pass">
                                <Form.Label>Contraseña:</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Ingresa la contraseña" 
                                    minLength={8}
                                    spellCheck={true}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Ingresar
                                </Button>
                            </div>
                        </Form>   
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default Login;

{/* <Button variant="primary" type="button" onClick={() => console.log(JSON.parse(localStorage.getItem('data')))}>
                    prueba de cookie
                </Button> */}