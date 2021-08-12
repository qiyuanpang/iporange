import { useEffect, useState } from "react";
import classes from './Profile.module.css';
import { Badge, Button } from 'react-bootstrap';

function Profile(props) {
    const [generalinfo, setGeneralinfo] = useState({});
    const [financialinfo, setFinancialinfo] = useState({});
    const [contactinfo, setContactinfo] = useState({});
    const Symbol = props.symbol;
    let priced = false;
    priced = props.priced ? true : false;
    useEffect(() => {
        let url;
        if (priced) {
            url = '/api/profile/' + Symbol;
        } else {
            url = '/api/upcoming-profile/' + Symbol;
        }
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            // console.log(data)
            setGeneralinfo(data.generalinfo);
            setFinancialinfo(data.financialinfo);
            setContactinfo(data.contactinfo);
        })
    }, [])
    return (
        <div className="container p-0" key={Symbol+"-profile-body"}>
            <div className="row" key={Symbol+"-profile-row1"}>
                <div className="col-6" key={Symbol+"-profile-col1"}>
                    <div className="container p-0" key={Symbol+"-profile-col1-container"}>
                        <div className={`"card" ${classes.card_height}`} key={Symbol+"-profile-card"}>
                            <div className="card-body p-0" key={Symbol+"-profile-card-body"}>
                                <h5 className="card-title">{generalinfo.company}</h5>
                                <ul className="list-group p-0" key={Symbol+"-profile-card-body-list"}>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57840).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Address</small>
                                        {/* <span className={`"badge badge-pill badge-light" ${classes.card_text}`}>{contactinfo.address}</span> */}
                                        <Badge bg='light' text='dark' pill className={classes.card_text}>{contactinfo.address}</Badge>
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57851).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Phone Number</small>
                                        <Badge bg='light' text='dark' pill>{contactinfo.phonenumber}</Badge>
                                        {/* <span>{contactinfo.phonenumber}</span> */}
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57862).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Website</small>
                                        <Badge bg='light' text='dark' pill><a href={contactinfo.website}>Click here</a></Badge>
                                        {/* <span><a href={contactinfo.website}>Click here</a></span> */}
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57873).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Revenues</small>
                                        <Badge bg='light' text='dark' pill>{financialinfo.revenues}</Badge>
                                        {/* <span>{financialinfo.revenues}</span> */}
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57884).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>NetIncome</small>
                                        <Badge bg='light' text='dark' pill>{financialinfo.netincome}</Badge>
                                        {/* <span>{financialinfo.netincome}</span> */}
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57895).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Founded</small>
                                        <Badge bg='light' text='dark' pill>{generalinfo.founded}</Badge>
                                        {/* <span>{generalinfo.founded}</span> */}
                                    </li>
                                    <li className="list-group-item" style={{border: "none"}} key={Symbol+"-profile-card-body-list-"+Math.floor(Math.random() * 57830).toString()}>
                                        <small className="text-muted" style={{color: '#6a6a6a'}}>Employees</small>
                                        <Badge bg='light' text='dark' pill>{generalinfo.employees}</Badge>
                                        {/* <span>{generalinfo.employees}</span> */}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6" key={Symbol+"-profile-col2"}>
                    <div className="container p-0" key={Symbol+"-profile-col2-container"}>
                        <div className={`"card" ${classes.card_height}`} key={Symbol+"-profile-col2-card"}>
                            <h5 className="card-title">Business</h5>
                            <div className={`"card-body overflow-scroll" ${classes.card_scroll} ${classes.card_height}`} key={Symbol+"-profile-col2-card-body"}>
                                <p className="card-text">{generalinfo.business}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;