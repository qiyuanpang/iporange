import {useRef} from 'react';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Form, Button, FormControl, Container, FormGroup, Label, Input} from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 30%;
    padding: 10px;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

.start {
    align-content: flex-start;
}

.middle {
    align-content: center;
}

.end {
    align-content: flex-end;
}
`

function LoginPage(props) {
    // const [isExistent, setIsExistent] = useState(0);
    
    const email = useRef();
    const password = useRef();

    function Login(event) {
        // const [isExistent, setIsExistent] = useState(0)
        event.preventDefault();

        const emailentered = email.current.value;
        const passwordentered = password.current.value;
        // var isExistent = 2;

        const data = {
            email: emailentered,
            password: passwordentered
        };
        props.onLogin(data);
    }
    
    return (
    <Styles>
        <div className="center container">
            <card className="card">
                <h3 >{props.Userdata.Message}</h3>
                <Form onSubmit={Login} key="loginform">
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required ref={email} name="email"/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required ref={password} name="password"/>
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group> */}
                    <div className='buttons'>
                        <Button variant="light" href='/forgotpassword' className="start">
                            Forgot password？
                        </Button>
                        <Button variant="primary" type="submit" className="middle" size="lg">
                            Login Now
                        </Button>
                        <Button variant="light" href='/signup' className="end">
                            Sign Up here
                        </Button>
                    </div>
                </Form>
            </card>
        </div>
    </Styles>
    )
    
}

export default LoginPage;