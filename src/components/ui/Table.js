// import classes from "./Table.module.css";
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

function TableHeader(props, type) {
    if (type === 'gain') {
        return (
            <tr className="table-success" key={"gainer-header"+Math.floor(Math.random() * 4321).toString()}>
                <th scope="col">Company</th>
                <th scope="col">Symbol</th>
                <th scope="col">Offer Date</th>
                <th scope="col">Offer Price</th>
                <th scope="col">Start Price</th>
                <th scope="col">Offer Return</th>
                <th scope="col">1st Day High</th>
                <th scope="col">1st Day MaxReturn</th>
                <th scope="col">1st Week High</th>
                <th scope="col">1st Week MaxReturn</th>
            </tr>
        )
    } else if (type === 'loss') {
        return (
            <tr className="table-success" key={"losser-header"+Math.floor(Math.random() * 4321).toString()}>
                <th scope="col">Company</th>
                <th scope="col">Symbol</th>
                <th scope="col">Offer Date</th>
                <th scope="col">Offer Price</th>
                <th scope="col">Start Price</th>
                <th scope="col">Offer Return</th>
                <th scope="col">1st Day Low</th>
                <th scope="col">1st Day MaxLoss</th>
                <th scope="col">1st Week Low</th>
                <th scope="col">1st Week MaxLow</th>
            </tr>
        )
    }
}

function TableData(props, type) {
    if (type === 'gain') {
        return props.ipos.map((ipo, index) => {
            const {id, company, symbol, offerprice, startprice, offerdate, offerreturn, high_1day, high_2day, high_7day, earn_1day, earn_2day, earn_7day} = ipo;
            return (
                <tr key={symbol+"-gainer-"+Math.floor(Math.random() * 12345).toString()} >
                    <td>{company}</td>
                    <td>
                        <Link key={symbol+"link"} to={"/ipos/"+symbol} >{symbol}</Link>
                        {/* <Link onClick={whichsymbol} key={symbol+"link"} >{symbol}</Link> */}
                        {/* <a className="btn btn-primary btn-lg" aria-disabled="true" key={symbol+"link"} onClick={whichsymbol}>{symbol}</a> */}
                    </td>
                    <td>{offerdate}</td>
                    <td>{offerprice}</td>
                    <td>{startprice}</td>
                    {Number.isFinite(offerreturn) ? ShowNum(offerreturn) : <td>{"N/A"}</td>}
                    {Number.isFinite(high_1day) ? <td>{high_1day}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(earn_1day) ? ShowNum(earn_1day) : <td>{"N/A"}</td>}
                    {Number.isFinite(Math.max(high_1day, high_2day, high_7day)) ? <td>{Math.max(high_1day, high_2day, high_7day)}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(Math.max(earn_1day, earn_2day, earn_7day)) ? ShowNum(Math.max(earn_1day, earn_2day, earn_7day)): <td>{"N/A"}</td>}
                </tr>
            )
        })
    } else if (type === 'loss') {
        return props.ipos.map((ipo, index) => {
            const {id, company, symbol, offerprice, startprice, offerdate, offerreturn, low_1day, low_2day, low_7day, loss_1day, loss_2day, loss_7day} = ipo;
            return (
                <tr key={symbol+"-losser-"+Math.floor(Math.random() * 12345).toString()} >
                    <td>{company}</td>
                    <td>
                        <Link key={symbol+"link"} to={"/ipos/"+symbol} >{symbol}</Link>
                        {/* <Link onClick={whichsymbol} key={symbol+"link"} >{symbol}</Link> */}
                        {/* <a className="btn btn-primary btn-lg" aria-disabled="true" key={symbol+"link"} onClick={whichsymbol}>{symbol}</a> */}
                    </td>
                    <td>{offerdate}</td>
                    <td>{offerprice}</td>
                    <td>{startprice}</td>
                    {Number.isFinite(offerreturn)  ? ShowNum(offerreturn) : <td>{"N/A"}</td>}
                    {Number.isFinite(low_1day) ? <td>{low_1day}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(loss_1day) ? ShowNum(loss_1day) : <td>{"N/A"}</td>}
                    {Number.isFinite(Math.min(low_1day, low_2day, low_7day)) ? <td>{Math.min(low_1day, low_2day, low_7day)}</td> : <td>{"N/A"}</td>}
                    {Number.isFinite(Math.min(loss_1day, loss_2day, loss_7day)) ? ShowNum(Math.min(loss_1day, loss_2day, loss_7day)) : <td>{"N/A"}</td>}
                </tr>
            )
        })
    }
}

function Table(props) {
    return (
        <table className="table table-striped table-hover table-bordered">
            <thead>
                {TableHeader(props, props.type)}
            </thead>
            <tbody>
                {TableData(props, props.type)}
            </tbody>
        </table>
    )
}

export default Table;