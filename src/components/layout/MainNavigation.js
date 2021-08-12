import {useRef} from 'react';
import { Navbar, Nav, Form, Button, NavDropdown, FormControl, Container} from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: auto;
    padding: 10px;
}

.right1 {
    position: relative;
    left: 350px;
}

.right2 {
    position: relative;
    left: 430px;
}

.search {
    postition: relative;
    left: 100px;

}
`

function MainNavigation(props) {
    const searchinput = useRef();

    function InOrOut(loginuser) {
        if (loginuser.length > 0) {
            return (
                // <a className="btn btn-primary btn-lg" href="/" role="button" aria-disabled="true" key="a-logout" onClick={props.onLogout}>Log Out</a>
                <div className="right2" key="logoutbutton">
                    <Button variant="outline-success" onClick={props.onLogout}>
                        <Nav.Link href='/'>Log Out</Nav.Link>
                    </Button>
                </div>
            )
        } else {
            return (
                // <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                //     <li className="nav-item">
                //         <a className="btn btn-primary btn-lg" href="/login" role="button" aria-disabled="true" key="a-login">Login</a>
                //     </li>
                //     <li className="nav-item">
                //         <a className="btn btn-primary btn-lg" href="/signup" role="button" aria-disabled="true" key="a-signup">Sign Up</a>
                //     </li>
                // </ul>
                <div className="right1" key="loginsignup">
                    <Button variant="outline-success">
                        <Nav.Link href='/login'>Login</Nav.Link>
                    </Button>
                    <Button variant="outline-success">
                        <Nav.Link href='/signup'>Sign Up</Nav.Link>
                    </Button>
                </div>
                
            )
        }
    }

    function Search(event) {
        event.preventDefault();
        const input = searchinput.current.value;
        props.onSearch(input);
    }

    return (
        <Styles>
            <div className="center" key='navigation-div-0'>
                <Navbar className="justify-content-center" bg="light" expand="lg" >
                    <Container>
                        <Navbar.Brand href="/" >IPO Secretary</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                            className="mr-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                            >
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/#/upcomingipos">Upcoming IPOs</Nav.Link>
                                <NavDropdown title="Categories" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="/#/ipos">Past IPOs</NavDropdown.Item>
                                    <NavDropdown.Item href="/#/sectors">Sectors</NavDropdown.Item>
                                    {/* <NavDropdown.Divider /> */}
                                    <NavDropdown.Item href="/#/underwriters">Underwriters</NavDropdown.Item>
                                </NavDropdown>
                                {/* <Nav.Link href="#" disabled>
                                    Link
                                </Nav.Link> */}
                            </Nav>
                            <div className="search">
                                <Form className="d-flex" onSubmit={Search}>
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        className="mr-2"
                                        aria-label="Search"
                                        ref={searchinput}
                                    />
                                    <Button variant="outline-success" type='submit'>Search</Button>
                                </Form>
                            </div>
                            <Nav
                            className="mr-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                            >
                                {InOrOut(props.LoginedUser)}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </Styles>
        
    )


}

export default MainNavigation;