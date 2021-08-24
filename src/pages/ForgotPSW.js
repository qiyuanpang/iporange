import {useRef} from 'react';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Form, Button, FormControl, Container, FormGroup, Label, Input} from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 50%;
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

function ForgotPSWPage(props) {
    // const [isExistent, setIsExistent] = useState(0);
    
    const email = useRef();

    function Check(event) {
        // const [isExistent, setIsExistent] = useState(0)
        event.preventDefault();

        const emailentered = email.current.value;

        const data = {
            email: emailentered
        };
        props.onCheck(data);
    }
    
    return (
    <Styles>
        <div className="center container">
            <card className="card">
                <h3 >{props.Userdata.Message}</h3>
                <Form onSubmit={Check} key="forgotepswform">
                    <Form.Group className="mb-3" controlId="formEmailRecord">
                        <Form.Label>Please enter your email to reset password:</Form.Label>
                        <Form.Control type="email" placeholder="email" required ref={email} name="email"/>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="middle" size="lg">
                        Send now
                    </Button>
                </Form>
            </card>
        </div>
    </Styles>
    )
    
}

export default ForgotPSWPage;