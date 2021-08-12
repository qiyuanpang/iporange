import {useRef} from 'react';
import { useState, useEffect } from 'react';
import { Form, Button, FormControl, Container, FormGroup, Label, Input} from 'react-bootstrap';
import styled from 'styled-components';
import PrefixPage from './Prefix';

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

function SignUpPage(props) {
    const [isExistent, setIsExistent] = useState(0);
    
    const email = useRef();
    const username = useRef();
    const password = useRef();

    function SubmitByJSON(event) {
        // const [isExistent, setIsExistent] = useState(0)
        event.preventDefault();

        const emailentered = email.current.value;
        const usernameentered = username.current.value;
        const passwordentered = password.current.value;
        // var isExistent = 2;

        const data = {
            email: emailentered,
            username: usernameentered,
            password: passwordentered
        };
        props.onSubmit(data);
    }
    
    return (
    <Styles>
        <div className="center container">
            <card className="card">
                <h3 >{props.Userdata.Message}</h3>
                <Form onSubmit={SubmitByJSON} key="submmitform">
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required ref={email} name="email"/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" required ref={username} name="username"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required ref={password} name="password"/>
                    </Form.Group>
                    <div className='buttons'>
                        {/* <Button variant="light" href='/' className="start">
                            Forgot password？
                        </Button> */}
                        <Button variant="primary" type="submit" className="middle" size="lg">
                            Sign Up Now
                        </Button>
                        <Button variant="light" href={PrefixPage+'/login'} className="end">
                            Login here
                        </Button>
                    </div>
                </Form>
            </card>
        </div>
    </Styles>
    )
    
}

export default SignUpPage;