// import logo from './logo.svg';
import {Route, Switch} from 'react-router-dom';
// import {Route} from 'react-router';
// import React, {useState, useEffect} from 'react';
// import './App.css';
import {Fragment} from 'react';
import { useState, useEffect } from 'react';
import HomePage from './pages/Home';
import UpcomingIPOsPage from './pages/UpcomingIPOs';
import FiledIPOsPage from './pages/FiledIPOs';
import IPOpipelinePage from './pages/IPOpipeline';
import Layout from './components/layout/Layout';
import AllIPOsPage from './pages/AllIPOs';
import OneIPOPage from './pages/OneIPO';
import UpcomingOneIPOPage from './pages/UpcomingOneIPO';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/Login';
import MultipleIPOsPage from './components/funcs/MultipleIPOs';
import MultipleUpcomingIPOsPage from './components/funcs/MultipleUpcomingIPOs';
import SubmitUserData from './components/funcs/SubmitUserData';
import SectorPage from './pages/Sector';
import UnderwriterPage from './pages/Underwriter';
import MultipleSectorsPage from './components/funcs/MultipleSectors';
import MultipleUnderwritersPage from './components/funcs/MultipleUnderwriters';
import AllSectorsPage from './pages/AllSectors';
import AllUnderwritersPage from './pages/AllUnderwriters';
import SearchResultsPage from './pages/SearchResults';
import { Navbar, Nav, Form, Button, NavDropdown, FormControl, Container} from 'react-bootstrap';

// import 'bootstrap/dist/css/bootstrap.css';
import FooterPage from './pages/Footer';
import ContactUSPage from './pages/ContactUs';
import OtherLinksPage from './pages/OtherLinksPage';
import ForgotPSWPage from './pages/ForgotPSW';
import ResetPSWPage from './pages/ResetPSW';

import styled from 'styled-components';

const Styles = styled.div`
.App {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
`


function App(props) {
  const [isInit, setisInit] = useState(true);
  const [symbols, setSymbols] = useState([{}]);
  const [upcomingsymbols, setUpcomingSymbols] = useState([{}]);
  const [sectors, setSectors] = useState([]);
  const [underwriters, setUnderwriters] = useState([]);
  const [userdata, setUserdata] = useState({Email: '', Username: '', Password: '', Message: ''});
  const [loginedUser, setLoginedUser] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [searchdata, setSearchData] = useState([]);
  const [searchinput, setSearchInput] = useState('');


  useEffect(() => {
    const loggedinuser = localStorage.getItem('loginuser');
    // console.log(loggedinuser)
    if (loggedinuser) {
      // const founduser = JSON.parse(loggedinuser);
      const founduser= loggedinuser;
      // console.log(founduser)
      setLoginedUser(founduser);
    }
  }, [isLogin]);


  function Search(input) {
    const url = "/api/search/" + input;
    const url1 = "/api/search/" + input;
    fetch(url1).then(response => {
      return response.json();
    }).then(data => {
      let urls = [];
      let sections = [];
      let texts = [];
      for (let k = 0; k < data.results.length; k++) {
        if (k< data.results.length-1) {
          urls.push(data.results[k].url+'/')
          sections.push(data.results[k].section+'/')
          texts.push(data.results[k].text+'/')
        } else {
          urls.push(data.results[k].url)
          sections.push(data.results[k].section)
          texts.push(data.results[k].text)
        }
      }
      localStorage.setItem('searchresults-urls', urls);
      localStorage.setItem('searchresults-sections', sections);
      localStorage.setItem('searchresults-texts', texts);
      
      // setSearchData(data);
      setSearchInput(data.input);
      window.location.href = '/search';
      // window.location.href = '/search/input?'+searchdata.input;
    })
  };

  function Logout() {
    localStorage.removeItem('loginuser');
    setLoginedUser('')
  }


  return (
      <div className='App'>
        <Layout LoginedUser={loginedUser} key="layout" onLogout={Logout} onSearch={Search} className="justify-content-center"/>
        <Switch key="switch">
          <Route path='/' key="route-home" exact>
            <HomePage key="home" />
          </Route>
          {/* <Route path='/upcomingipos' exact key="route-upcomingipos">
            <UpcomingIPOsPage key="upcomingipos"/>
          </Route> */}
          {/* <Route path='/filedipos' key="route-filedipos">
            <FiledIPOsPage key="filedipos"/>
          </Route> */}
          {/* <Route path='/ipopipeline' key="route-ipopipeline">
            <IPOpipelinePage key="ipopipeline"/>
          </Route> */}
          {/* <Route path='/ipos' exact key="route-allipos">
            <AllIPOsPage key="allipos" />
          </Route > */}
          {/* <Route path="/ipos/:Symbol/:Subpage"  key={"route-symbol-subpage"}>
            <OneIPOPage key={"ipos-symbol-subpage"} User={loginedUser} priced={true}/>
          </Route> */}
          {/* <Route path="/upcomingipos/:Symbol/:Subpage" key={"route-upcoming-symbol-subpage"}>
            <UpcomingOneIPOPage key={"upcoming-symbol-subpage"} User={loginedUser} priced={false}/>
          </Route> */}
          {/* <Route path='/signup' exact key="route-signup">
            <SignUpPage key="signup" onSubmit={SubmitUserData} Userdata={userdata}/>
          </Route> */}
          {/* <Route path='/login' exact key="route-login">
            <LoginPage key="login" onLogin={CheckUserData} Userdata={userdata}/>
          </Route> */}
          {/* <Route path='/sectors/:sectorurl' key={"route-sector"}>
            <SectorPage key={"sectorpage-sector"} User={loginedUser}/>
          </Route> */}
          {/* <Route path='/underwriters/:underwriterurl' key={"route-underwriter"}>
            <UnderwriterPage key={"underwriterpage-underwriter"} User={loginedUser}/>
          </Route> */}
          {/* <Route path='/sectors' exact key="route-allsectors">
            <AllSectorsPage key="allsectors" loginedUser={loginedUser}/>
          </Route> */}
          {/* <Route path='/underwriters' exact key="route-allunderwriters">
            <AllUnderwritersPage key="allunderwriters" loginedUser={loginedUser}/>
          </Route> */}
          {/* <Route path={'/search'}  key={"route-search"}>
            <SearchResultsPage key={"search-results"} input={searchdata}/>
          </Route> */}
          {/* <Route path='/contactus' exact key='route-contactus'>
            <ContactUSPage />
          </Route> */}
          {/* <Route path='/otherlinks' exact key='route-otherlinks'>
            <OtherLinksPage />
          </Route> */}
          {/* <Route path='/forgotpassword' exact key='route-forgotpassword'>
            <ForgotPSWPage onCheck={CheckEmail} Userdata={userdata}/>
          </Route> */}
          {/* <Route path='/resetpassword/:username' key='route-resetpassword'>
            <ResetPSWPage onResetPSW={ResetPSW} Userdata={userdata}/>
          </Route> */}
        </Switch>
        {/* <FooterPage /> */}
      </div>
  )
}

export default App;
