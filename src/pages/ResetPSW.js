import {useRef} from 'react';
import { Link, useParams } from 'react-router-dom'
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

function ResetPSWPage(props) {
    // const [isExistent, setIsExistent] = useState(0);
    const params = useParams();
    const password = useRef();
    const [existence, setExistence] = useState(false);

    useEffect(() => {
        const url = '/api/checkusername/' + params.username;
        fetch(url).then(response => {
            return response.json();
        }).then(existornot => {
            if (existornot[0].EXIST === 0) {
                setExistence(false);
            } else {
                setExistence(true);
            }
        })
    },[params])

    function UpdatePSW(event) {
        // const [isExistent, setIsExistent] = useState(0)
        event.preventDefault();

        const pswentered = password.current.value;

        const data = {
            password: pswentered,
            username: params.username
        };
        // console.log(data)
        props.onResetPSW(data);
    }
    if (existence) {
        return (
        <Styles>
            <div className="center container">
                <card className="card">
                    <h3 >{props.Userdata.Message}</h3>
                    <Form onSubmit={UpdatePSW} key="forgotepswform">
                        <Form.Group className="mb-3" controlId="formEmailRecord">
                            <Form.Label>Please enter your new password:</Form.Label>
                            <Form.Control type="password" placeholder="new password" required ref={password} name="newpassword"/>
                        </Form.Group>
                        <Button variant="primary" type="submit" size="lg">
                            Update
                        </Button>
                    </Form>
                </card>
            </div>
        </Styles>
        )
    } else {
        return (
            <div>

            </div>
        )
    }

    
}

export default ResetPSWPage;