import React from "react";
import styled from 'styled-components';
import { Navbar, Nav, Form, Button, NavDropdown, FormControl, Container} from 'react-bootstrap';
import PrefixPage from "./Prefix";


const Styles = styled.div`
background-color: #EAFAF1;

.footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: auto;
    background-color: light;
    width: auto;
    
}

.button {
    justify-content: flex-end;
}

.right1 {
    position: absolute;
    right: 400px;
    bottom: 8px;
}

.right2 {
    position: absolute;
    right: 250px;
    bottom: 8px;
}

.text {
    
    color: #BDC3C7;
}
`

const FooterPage = () => (
<Styles>
    <div className="footer">
        <Navbar className="justify-content-center" bg="light" expand="sm" >
            <Container>
                <Navbar.Brand href="/" className='text'>Copyright 2021 - 2021 @ IPORange.com</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll" className='button'>
                    <Nav
                    className="mr-auto my-2 my-lg-0 right"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                    >
                        <Nav.Link href={PrefixPage+"/otherlinks"} >OTHER LINKS</Nav.Link>
                        <Nav.Link href={PrefixPage+"/contactus"} >CONTACT US</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
</Styles>
);

export default FooterPage;
