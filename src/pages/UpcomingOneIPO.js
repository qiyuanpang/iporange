import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import WhichSubPage from "../components/singlepage/WhichSubPage";
// import classes from "./OneIPO.module.css";
import redorgreen from "../components/funcs/RedOrGreen";
import { Badge, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PrefixPage from './Prefix';

const Styles = styled.div`
.center {
    margin: auto;
    width: 70%;
    padding: 10px;
}
`

function RecordTable(props, symbol) {
    if (props.High_1day) {
        return (
            <table key={symbol+"record-table"}>
                <thead>
                    <tr className="table-success" key={symbol+"record-table-header"}>
                        <th scope="col">
                            Days
                        </th>
                        <th scope="col">
                            High
                        </th>
                        <th scope="col">
                            Low
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={symbol+"record-table-body-item-1"}>
                        <td>{"1"}</td>
                        { (props.High_1day > 0) ? <td>{props.High_1day.toFixed(2)}{redorgreen(props.Earn_1day)}</td> : <td>{"N/A"}</td>}
                        { (props.High_1day > 0) ? <td>{props.Low_1day.toFixed(2)}{redorgreen(props.Loss_1day)}</td> : <td>{"N/A"}</td>}
                    </tr>
                    <tr key={symbol+"record-table-body-item-2"}>
                        <td>{"2"}</td>
                        { (props.High_2day > 0) ? <td>{props.High_2day.toFixed(2)}{redorgreen(props.Earn_2day)}</td> : <td>{"N/A"}</td>}
                        { (props.High_2day > 0) ? <td>{props.Low_2day.toFixed(2)}{redorgreen(props.Loss_2day)}</td> : <td>{"N/A"}</td>}
                    </tr>
                    <tr key={symbol+"record-table-body-item-3"}>
                        <td>{"7"}</td>
                        { (props.High_7day > 0) ? <td>{props.High_7day.toFixed(2)}{redorgreen(props.Earn_7day)}</td> : <td>{"N/A"}</td>}
                        { (props.High_7day > 0) ? <td>{props.Low_7day.toFixed(2)}{redorgreen(props.Loss_7day)}</td> : <td>{"N/A"}</td>}
                    </tr>
                    <tr key={symbol+"record-table-body-item-4"}>
                        <td>{"14"}</td>
                        { (props.High_14day > 0) ? <td>{props.High_14day.toFixed(2)}{redorgreen(props.Earn_14day)}</td> : <td>{"N/A"}</td>}
                        { (props.High_14day > 0) ? <td>{props.Low_14day.toFixed(2)}{redorgreen(props.Loss_14day)}</td> : <td>{"N/A"}</td>}
                    </tr>
                    <tr key={symbol+"record-table-body-item-5"}>
                        <td>{"30"}</td>
                        { (props.High_30day > 0) ? <td>{props.High_30day.toFixed(2)}{redorgreen(props.Earn_30day)}</td> : <td>{"N/A"}</td>}
                        { (props.High_30day > 0) ? <td>{props.Low_30day.toFixed(2)}{redorgreen(props.Loss_30day)}</td> : <td>{"N/A"}</td>}
                    </tr>
                </tbody>
            </table>
        )
    } else {
        return ;
    }
}

function ColorPrice(change, percent) {
    if (change > 0) {
        return (
            <p> 
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#21CA07'}}>{`${change}`}</span>
                </Badge>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#21CA07'}}>{percent}</span>
                </Badge>
            </p>
        )
    } else if (change < 0) {
        return (
            <p>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#EB2D16'}}>{`${change}`}</span>
                </Badge>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#EB2D16'}}>{percent}</span>
                </Badge>
            </p>
        )
    } else {
        return (
            <p>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#808B96'}}>{`${change}`}</span>
                </Badge>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#808B96'}}>{percent}</span>
                </Badge>
            </p>
        )
    }
}

function ShowAuth(text, num, auth, url) {
    if (auth) {
        if (num > 0) {
            return (
                
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#21CA07'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
            )
        } else if (num < 0) {
            return (
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#EB2D16'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
            )
        } else {
            return (
                    <Badge bg='light' text='dark' pill>
                        <a href={PrefixPage+url}>{`${text}    `}</a>
                        <span style={{color: '#566573'}}>{`${(num*100).toFixed(2)} %`}</span>
                    </Badge>
            )
        }
    } else {
        return (
                <Badge bg='light' text='dark' pill>
                    <a href={PrefixPage+url}>{text+"    "}</a>
                    <span style={{color: '#566573'}}><a href='/login' style={{color: '#566573'}}>{'hiden'}</a></span>
                </Badge>
        )
    }

}

function UpcomingOneIPOPage(props){
    const [isLoadingIPO, setIsLoadingIPO] = useState(true);
    const [loadedIPO, setLoadedIPO] = useState({});
    const [similaripos, setSimilarIPOs] = useState([]);
    const [priced, setPriced] = useState(false);
    const params = useParams();
    const {Symbol, Subpage} = params;
    let User = props.User;
    let Auth = false;
    Auth = (User.length > 0) ? true : false;
    // if (Subpage.length > 0) {
    //     Subpage = Subpage.substring(1)
    // }
    useEffect(() => {
        // setIsLoadingIPO(true);
        const url = "/api/upcoming/" + params.Symbol;
        
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            setLoadedIPO(data.basic);
            setSimilarIPOs(data.similaripos);
            // setSimilarIPOs(data.similaripos);
        });
        // setIsLoadingIPO(false);
    }, [params]);
    // useEffect(() => {
    //     // setIsLoadingIPO(true);
    //     const url = "/api/upcoming/" + Symbol;
        
    //     fetch(url).then(response => {
    //         return response.json();
    //     }).then(data => {
    //         // setLoadedIPO(data.basic);
    //         setSimilarIPOs(data.similaripos);
    //     });
    //     // setIsLoadingIPO(false);
    // }, []);
    // console.log(loadedIPO)
    return (
        <Styles>
            <div className="center" key={Symbol+"_1"}>
                <div className="row" key={Symbol+"_row_1"}>
                    <div className="col align-self-start">
                        <h3 style={{color: "black"}}><a href={PrefixPage+'/upcomingipos'}>{"Upcoming IPOs"}</a>{' > '+loadedIPO.company}</h3>
                    </div>
                </div>
                <div className="row" key={Symbol+"_row_2"}>
                    <div className="row" key={Symbol+"_in_row_3"}>
                        <p>{"Similar IPOs:  "}{Auth ? similaripos.map(item => {return (<span key={"similar_"+Symbol+"_"+item}><a href={PrefixPage+'/ipos/'+item+'/overview'}>{`${item}    `}</a></span>)}) : <span key={"similar_"+Symbol+"_hiden"}><a href={PrefixPage+'/login'} style={{color: '#566573'}}>{"hiden"}</a></span>}</p>
                    </div>
                </div>
                
                
                <div className="row">
                    <div className="col-12">
                        <ul className="nav nav-tabs" style={{width: "100%"}}>
                            <li className="nav-item" key={Symbol+"-page-1"}>
                                <a className={"nav-link"+((Subpage==="overview") ? " active":"")} aria-current="page" href={PrefixPage+"/upcomingipos/"+Symbol+"/overview"}>Overview</a>
                            </li>
                            <li className="nav-item" key={Symbol+"-page-2"}>
                                <a className={"nav-link"+((Subpage==="news") ? " active":"")} href={PrefixPage+"/upcomingipos/"+Symbol+"/news"}>News</a>
                            </li>
                            <li className="nav-item" key={Symbol+"-page-3"}>
                                <a className={"nav-link"+((Subpage==="comments") ? " active":"")} href={PrefixPage+"/upcomingipos/"+Symbol+"/comments"}>Comments</a>
                            </li>
                            <li className="nav-item" key={Symbol+"-page-4"}>
                                <a className={"nav-link"+((Subpage==="historicalquotes") ? " active":"")} href={PrefixPage+"/upcomingipos/"+Symbol+"/historicalquotes"}>Historical Quotes</a>
                            </li>
                            <li className="nav-item" key={Symbol+"-page-5"}>
                                <a className={"nav-link"+((Subpage==="profile") ? " active":"")} href={PrefixPage+"/upcomingipos/"+Symbol+"/profile"}>Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row" key={Symbol+"_row_3"}>
                    <div className="col-12" key={Symbol+"_3"}>
                        {<WhichSubPage subpage={Subpage} symbol={Symbol} key={Symbol+"__"+Subpage} Auth={Auth} priced={false}/>}
                    </div>
                </div>
                
            </div>
        </Styles>
    )
    
    
}

export default UpcomingOneIPOPage;
