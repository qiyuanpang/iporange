import { Link } from 'react-router-dom';
import {Fragment} from 'react';
import { Badge } from 'react-bootstrap';

function ShowNum(num) {
    if (num > 0) {
        return (
            <td>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#21CA07'}}>{`${(num*100).toFixed(2)} %`}</span>
                </Badge>
            </td>
        )
    } else if (num < 0) {
        return (
            <td>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#EB2D16'}}>{`${(num*100).toFixed(2)} %`}</span>
                </Badge>
            </td>
        )
    } else {
        return (
            <td>
                <Badge bg='light' text='dark' pill>
                    <span style={{color: '#566573'}}>{`${(num*100).toFixed(2)} %`}</span>
                </Badge>
            </td>
        )
    }
}

function TableHeader(props) {
    return (
        <Fragment>
            <tr className="table-success" key={"gainer-header"+Math.floor(Math.random() * 54321).toString()}>
                <th rowSpan="2">{props.SorU}</th>
                <th colSpan="3">{"Last 3 Months"}</th>
                <th colSpan="3">{"Last 6 Months"}</th>
                <th colSpan="3">{"Last 12 Months"}</th>
            </tr>
            <tr className="table-success" key={"gainer-header"+Math.floor(Math.random() * 54321).toString()}>
                <th>{"#IPOs"}</th>
                <th>{"avg offer return"}</th>
                <th>{"avg max return"}</th>
                <th>{"#IPOs"}</th>
                <th>{"avg offer return"}</th>
                <th>{"avg max return"}</th>
                <th>{"#IPOs"}</th>
                <th>{"avg offer return"}</th>
                <th>{"avg max return"}</th>
            </tr>
        </Fragment>
    )
}

function TableData(props) {
    if (props.Auth) {
        return props.items.map((item, index) => {
            const {name, return_3, return_6, return_12, return_h_3, return_h_6, return_h_12, num_3, num_6, num_12, url} = item;
            return (
                <tr key={props.SorU+url+Math.floor(Math.random() * 79383).toString()} >
                    <td>
                        <Link key={url+"-link"} to={"/"+props.SorU+"/"+url} >{name}</Link>
                        {/* <Link onClick={whichsymbol} key={symbol+"link"} >{symbol}</Link> */}
                        {/* <a className="btn btn-primary btn-lg" aria-disabled="true" key={symbol+"link"} onClick={whichsymbol}>{symbol}</a> */}
                    </td>
                    {Number.isFinite(num_3) ? <td>{num_3}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(return_3) ? ShowNum(return_3) : <td>{"N/A"}</td>}
                    {Number.isFinite(return_h_3) ? ShowNum(return_h_3) : <td>{"N/A"}</td>}
                    {Number.isFinite(num_6) ? <td>{num_6}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(return_6) ? ShowNum(return_6) : <td>{"N/A"}</td>}
                    {Number.isFinite(return_h_6) ? ShowNum(return_h_6) : <td>{"N/A"}</td>}
                    {Number.isFinite(num_12) ? <td>{num_12}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(return_12) ? ShowNum(return_12) : <td>{"N/A"}</td>}
                    {Number.isFinite(return_h_12) ? ShowNum(return_h_12) : <td>{"N/A"}</td>}
                </tr>
            )
        })
    } else {
        return props.items.map((item, index) => {
            const {name, return_3, return_6, return_12, return_h_3, return_h_6, return_h_12, num_3, num_6, num_12, url} = item;
            return (
                <tr key={props.SorU+url+Math.floor(Math.random() * 79383).toString()} >
                    <td>
                        <Link key={url+"-link"} to={"/"+props.SorU+"/"+url} >{name}</Link>
                        {/* <Link onClick={whichsymbol} key={symbol+"link"} >{symbol}</Link> */}
                        {/* <a className="btn btn-primary btn-lg" aria-disabled="true" key={symbol+"link"} onClick={whichsymbol}>{symbol}</a> */}
                    </td>
                    {Number.isFinite(num_3) ? <td>{num_3}</td> : <td>{"N/A"}</td>}
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                    {Number.isFinite(num_6) ? <td>{num_6}</td> : <td>{"N/A"}</td>}
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                    {Number.isFinite(num_12) ? <td>{num_12}</td> : <td>{"N/A"}</td>}
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                    <td><Badge bg='light' text='dark' pill><span style={{color: '#566573'}}><a href="/login" style={{color: '#566573'}}>{"hiden"}</a></span></Badge></td>
                </tr>
            )
        })
    }
}

function Table2(props) {
    return (
        <table className="table table-striped table-hover table-bordered">
            <thead>
                {TableHeader(props)}
            </thead>
            <tbody>
                {TableData(props)}
            </tbody>
        </table>
    )
}

export default Table2;