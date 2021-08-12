import { Link } from 'react-router-dom';
import {Fragment} from 'react';

function TableHeader(props) {
    return (
        <Fragment>
            <tr className="table-success" key={"gainer-header"+Math.floor(Math.random() * 54321).toString()}>
                <th>{"Company"}</th>
                <th>{"Symbol"}</th>
                <th>{"Shares(Millions)"}</th>
                <th>{"Price Low"}</th>
                <th>{"Price High"}</th>
                <th>{"Underwriters"}</th>
                <th>{"Expected Offer Date"}</th>
            </tr>
        </Fragment>
    )
}

function TableData(props) {
    return props.items.map((item, index) => {
        const {company, symbol, shares, pricelow, pricehigh, underwriters, offerdate} = item;
        return (
            <tr key={"upcomingipos-"+symbol} >
                <td>{company}</td>
                <td>
                    <Link key={symbol+"-link"} to={"/ipos/"+symbol} >{symbol}</Link>
                </td>
                <td>{shares}</td>
                <td>{pricelow}</td>
                <td>{pricehigh}</td>
                <td>{underwriters}</td>
                <td>{offerdate}</td>
            </tr>
        )
    })
}

function Table3(props) {
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

export default Table3;