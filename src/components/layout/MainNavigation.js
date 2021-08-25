import {useRef} from 'react';
import { Navbar, Nav, Form, Button, NavDropdown, FormControl, Container} from 'react-bootstrap';
import styled from 'styled-components';
import PrefixPage from '../../pages/Prefix';

const Styles = styled.div`
background-color: #EAFAF1;

.navbar-brand {
    display: flex;
    align-items: center;
  }

.navbar-brand>img {
padding: 7px 7px;
}

.nav-logo {
    float: left;
    margin-top: -15px;
  }

.center {
    display: flex;
    background-color: #EAFAF1;
    margin: auto;
    width: auto;
    padding: 10px;
}

#button {
    align-self: flex-end;
}

.category {
    align-self: flex-start;
}


.search {
    align-self: center;
}
`

function MainNavigation(props) {
    const searchinput = useRef();

    function InOrOut(loginuser) {
        if (loginuser.length > 0) {
            return (
                // <a className="btn btn-primary btn-lg" href="/" role="button" aria-disabled="true" key="a-logout" onClick={props.onLogout}>Log Out</a>
                <div  key="logoutbutton" >
                    <Button variant="outline-danger" onClick={props.onLogout}>
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
                <div key="loginsignup" >
                    <Button variant="outline-success">
                        <Nav.Link href={PrefixPage+'/login'}>Login</Nav.Link>
                    </Button>
                    <Button variant="outline-success">
                        <Nav.Link href={PrefixPage+'/signup'}>Sign Up</Nav.Link>
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
                <Navbar className="justify-content-center" bg="light" expand="lg" fixed="top">
                    <Container >
                        <a class="navbar-brand" href="/">
                            <img src="./logo192.png" width="50" height="50"/>
                        </a>
                        <Navbar.Brand href="/" >IPO Range</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll" >
                            <Nav
                            className="mr-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                            >
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href={PrefixPage+"/upcomingipos"}>Upcoming IPOs</Nav.Link>
                                <NavDropdown title="Categories" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href={PrefixPage+"/ipos"}>Priced IPOs</NavDropdown.Item>
                                    <NavDropdown.Item href={PrefixPage+"/sectors"}>Sectors</NavDropdown.Item>
                                    {/* <NavDropdown.Divider /> */}
                                    <NavDropdown.Item href={PrefixPage+"/underwriters"}>Underwriters</NavDropdown.Item>
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
                                        className="mr-4"
                                        aria-label="Search"
                                        ref={searchinput}
                                    />
                                    <Button variant="outline-success" type='submit'>Search</Button>
                                </Form>
                            </div>
                        </Navbar.Collapse>
                        
                        <Nav
                        className="mr-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        id = 'button'
                        navbarScroll
                        >
                            {InOrOut(props.LoginedUser)}
                        </Nav>
                    </Container>
                    
                </Navbar>
            </div>
            
        </Styles>
        
    )


}

export default MainNavigation;
