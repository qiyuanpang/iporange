// import classes from "./Overview.module.css";
import { useState, useEffect, Fragment } from 'react';
import { Badge, Button } from 'react-bootstrap';
import PrefixPage from '../../pages/Prefix';

function ShowUnderwriters(text, num, auth, url) {
    if (auth) {
        if (num >= 0) {
            return (
                <Fragment>
                    <td ><a href={PrefixPage+url} style={{color: '#17202A '}}>{text}</a></td>
                    <td >
                        <Badge bg='light' text='dark' pill>
                            <span  style={{color: '#21CA07'}}>{`${(num*100).toFixed(2)} %`}</span>
                        </Badge>
                    </td>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <td ><a href={PrefixPage+url} style={{color: '#17202A '}}>{text}</a></td>
                    <td >
                        <Badge bg='light' text='dark' pill>
                            <span  style={{color: '#EB2D16'}}>{`${(num*100).toFixed(2)} %`}</span>
                        </Badge>
                    </td>
                </Fragment>
            )
        }
    } else {
        return (
            <Fragment>
                <td ><a href={PrefixPage+url} style={{color: '#17202A '}}>{text}</a></td>
                <td >
                    <Badge bg='light' text='dark' pill>
                        <span  style={{color: '#566573'}}><a href={PrefixPage+'/login'} style={{color: '#566573'}}>{'hidden'}</a></span>
                    </Badge>
                </td>
            </Fragment>
        )
    }
}

function Underwriters(props, symbol, auth) {
    return props.map(item => {
        // const {underwriter} = item;
        return (
            <tr key={symbol+"_"+item.underwriter}>
                {ShowUnderwriters(item.underwriter, item.Return_6, auth, "/underwriters/"+item.url)}    
            </tr>
        )
    })
}

function ShowAuth(text, num, auth, url) {
    if (auth) {
        if (num > 0) {
            return (
                <td>
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#21CA07'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
                </td>
            )
        } else if (num < 0) {
            return (
                <td>
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#EB2D16'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
                </td>
            )
        } else {
            return (
                <td>
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#566573'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
                </td>
            )
        }
    } else {
        return (
            <td>
                <Badge bg='light' text='dark' pill>
                    <a href={PrefixPage+url}>{text+"    "}</a>
                    <span style={{color: '#566573'}}><a href={PrefixPage+'/login'} style={{color: '#566573'}}>{'hidden'}</a></span>
                </Badge>
            </td>
        )
    }

}

function Overview(props){
    const [generalinfo, setGeneralinfo] = useState({});
    const [underwriters, setUnderwriters] = useState([{}]);
    const [sector, setSector] = useState({});
    const [basic, setBasic] = useState({});
    const Symbol = props.symbol;
    const Auth = props.Auth;
    let priced = false;
    priced = props.priced ? true : false;
    // console.log(priced)
    
    useEffect(() => {
        let url;
        if (priced) {
            url = "/api/overview/" + Symbol;
        } else {
            url = '/api/upcoming-overview/' + Symbol;
        }
        // console.log(url)
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            setGeneralinfo(data.generalinfo)
            setUnderwriters(data.underwriters)
            setSector(data.sector)
            setBasic({'company': data.company, 'symbol': data.symbol, 'offerprice': data.offerprice, 'offerdate': data.offerdate, 'shares': data.shares, 'startprice': data.startprice})
        })
    },[])
    // console.log(basic, generalinfo)
    return (
        <div className="container">
            <div className="row">
                <div className="container-fluid p-0">
                    <header >
                        <h6 className="title">
                            <span style={{color: '#006699'}}>Key Data</span>
                        </h6>
                    </header>
                    <table className="table">
                        <tbody>
                            <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98765).toString()}>
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Sector</small></td>
                                {/* <td><Badge bg='light' text='dark' pill>{`${sector.sector} (${Auth ? sector.Return_6 : 'hidden'})`}</span></td> */}
                                {ShowAuth(sector.sector, sector.Return_6, Auth, "/sectors/"+sector.url)}
                            {/* </tr>
                            <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98764).toString()}> */}
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Industry</small></td>
                                {/* <td><span className="badge badge-pill">{generalinfo.industry}</span></td> */}
                                <td><Badge bg='light' text='dark' pill>{generalinfo.industry}</Badge></td>
                            </tr>
                            <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98763).toString()}>
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Offer Date</small></td>
                                {/* <td><Badge bg='light' text='dark' pill>{basic.offerdate}</span></td> */}
                                <td><Badge bg='light' text='dark' pill>{basic.offerdate}</Badge></td>
                            {/* </tr>
                            <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98762).toString()}> */}
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Offer Price</small></td>
                                {/* <td><Badge bg='light' text='dark' pill>{basic.offerprice}</span></td> */}
                                <td><Badge bg='light' text='dark' pill>{basic.offerprice}</Badge></td>

                            </tr>
                            {/* <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98761).toString()}>
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Start Price</small></td>
                                {ShowAuth(basic.startprice, (basic.startprice-basic.offerprice)/basic.offerprice, true, "*")}
                                
                            </tr> */}
                            <tr key={props.symbol+"overview"+Math.floor(Math.random() * 98760).toString()}>
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Released Shares</small></td>
                                {/* <td><Badge bg='light' text='dark' pill>{basic.shares}</span></td> */}
                                <td><Badge bg='light' text='dark' pill>{basic.shares}</Badge></td>
                                <td><small className="text-muted" style={{color: '#6a6a6a'}}>Outstanding Shares</small></td>
                                {/* <td><Badge bg='light' text='dark' pill>{0}</span></td> */}
                                <td><Badge bg='light' text='dark' pill>{0}</Badge></td>

                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
                <div className="container-fluid p-0">
                    <header>
                        <h6 className="title">
                            <span style={{color: '#006699'}}>Underwriters</span>
                        </h6>
                    </header>
                    <table className="table">
                        <tbody>
                            {Underwriters(underwriters, Symbol, Auth)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Overview;