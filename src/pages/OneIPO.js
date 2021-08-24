import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import WhichSubPage from "../components/singlepage/WhichSubPage";
// import classes from "./OneIPO.module.css";
import redorgreen from "../components/funcs/RedOrGreen";
import styled from 'styled-components';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Navbar, Nav, Form, Button, NavDropdown, FormControl, Container} from 'react-bootstrap';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import PrefixPage from './Prefix';

const Styles = styled.div`
.center {
    margin: auto;
    width: 70%;
    padding: 10px;
}
`

const StylesTable = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      :nth-child(even) {
        background-color: #f2f2f2;
      }
      :hover td {
        background-color: #f2f2f2;
      }
    }

    th {
      background-color: #C5E8CD;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
  
`

function Table({ columns, data}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
  
  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
            {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    if ((cell.column.Header === 'Return' || cell.column.Header === 'Loss') && cell.value != '-/-') {
                        return <td>{redorgreen(cell.value)}</td>
                    } else if ((cell.column.Header === 'High' || cell.column.Header === 'Low') && cell.value != '-/-') {
                        return <td>{cell.value}</td>
                    } else {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }
                //   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
        })}
        </tbody>
      </table>
    </>
  )
}


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
                    <span style={{color: '#566573'}}><a href={PrefixPage+'/login'} style={{color: '#566573'}}>{'hiden'}</a></span>
                </Badge>
        )
    }

}

function OneIPOPage(props){
    const [isLoadingIPO, setIsLoadingIPO] = useState(true);
    const [loadedIPO, setLoadedIPO] = useState({});
    const [ipodata, setIPOdata] = useState([{}]);
    const [similaripos, setSimilarIPOs] = useState([]);
    const params = useParams();
    const {Symbol, Subpage} = params;
    // const [priced, setPriced] = useState(false);
    // console.log(Symbol, Subpage)
    let User = props.User;
    let Auth = false;
    Auth = (User.length > 0) ? true : false;
    // if (Subpage.length > 0) {
    //     Subpage = Subpage.substring(1)
    // }

    const columns = React.useMemo(
        () => [
        {
        Header: "Days",
        accessor: "days"
        },
        {
        Header: "High",
        accessor: "high"
        },
        {
        Header: "Return",
        accessor: "return"
        },
        {
        Header: "Low",
        accessor: "low"
        },
        {
        Header: "Loss",
        accessor: "loss"
        }
    ],[]
    );
    
    useEffect(() => {
        // setIsLoadingIPO(true);
        let url = "/api/ipos/" + params.Symbol;
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            // console.log(data);
            let ipos = [];
            let d = {};
            if (data.basic.High_1day) {
                d = {'days': 1, 'high': data.basic.High_1day.toFixed(2), 'return': data.basic.Earn_1day, 'low': data.basic.Low_1day.toFixed(2), 'loss': data.basic.Loss_1day}
            } else {
                d = {'days': 1, 'high': '-/-', 'return': '-/-', 'low': '-/-', 'loss': '-/-'}
            }
            ipos.push(d)
            if (data.basic.High_2day) {
                d = {'days': 2, 'high': data.basic.High_2day.toFixed(2), 'return': data.basic.Earn_2day, 'low': data.basic.Low_2day.toFixed(2), 'loss': data.basic.Loss_2day}
            } else {
                d = {'days': 2, 'high': '-/-', 'return': '-/-', 'low': '-/-', 'loss': '-/-'}
            }
            ipos.push(d)
            if (data.basic.High_7day) {
                d = {'days': 7, 'high': data.basic.High_7day.toFixed(2), 'return': data.basic.Earn_7day, 'low': data.basic.Low_7day.toFixed(2), 'loss': data.basic.Loss_7day}
            } else {
                d = {'days': 7, 'high': '-/-', 'return': '-/-', 'low': '-/-', 'loss': '-/-'}
            }
            ipos.push(d)
            if (data.basic.High_14day) {
                d = {'days': 14, 'high': data.basic.High_14day.toFixed(2), 'return': data.basic.Earn_14day, 'low': data.basic.Low_14day.toFixed(2), 'loss': data.basic.Loss_14day}
            } else {
                d = {'days': 14, 'high': '-/-', 'return': '-/-', 'low': '-/-', 'loss': '-/-'}
            }
            ipos.push(d)
            if (data.basic.High_30day) {
                d = {'days': 30, 'high': data.basic.High_30day.toFixed(2), 'return': data.basic.Earn_30day, 'low': data.basic.Low_30day.toFixed(2), 'loss': data.basic.Loss_30day}
            } else {
                d = {'days': 30, 'high': '-/-', 'return': '-/-', 'low': '-/-', 'loss': '-/-'}
            }
            ipos.push(d)
            setIPOdata(ipos);
            setLoadedIPO(data.basic);
            setSimilarIPOs(data.similaripos);
            // setSimilarIPOs(data.similaripos);
        });
        // setIsLoadingIPO(false);
    }, [params]);

    // useEffect(() => {
    //     // setIsLoadingIPO(true);
    //     let url = "/api/ipos/" + params.Symbol;
    //     fetch(url).then(response => {
    //         return response.json();
    //     }).then(data => {
    //         setLoadedIPO(data.basic);
    //         // setSimilarIPOs(data.similaripos);
    //     });
    //     // setIsLoadingIPO(false);
    // }, [params]);
    // useEffect(() => {
    //     // setIsLoadingIPO(true);
    //     const url = "/api/ipos/" + params.Symbol;

    //     fetch(url).then(response => {
    //         return response.json();
    //     }).then(data => {
    //         // setLoadedIPO(data.basic);
    //         setSimilarIPOs(data.similaripos);
    //     });
    //     // setIsLoadingIPO(false);
    // }, [params]);
    // console.log(ipodata)
    return (
    <Styles>
        <div className="center container" key={Symbol+"_1"}>
            <div className="row" key={Symbol+"_row_1"}>
                <div className="col align-self-start">
                    <h3 style={{color: "black"}}><a href={PrefixPage+'/ipos'}>{"Priced IPOs"}</a>{' > '+loadedIPO.company}</h3>
                </div>
            </div>
            <div className="row" key={Symbol+"_row_2"}>
                <div className="col-sm d-flex">
                    <div className="card card-body flex-fill">
                        <small>
                            <div>
                                {loadedIPO.status}
                            </div>
                        </small>
                        <div>
                            <h3>
                                {/* <sup className="character">{'$'}</sup> */}
                                <span><a style={{color: 'black'}} href={`${"https://www.marketwatch.com/investing/stock/"}${Symbol.toLowerCase()}${"?mod=quote_search"}`}>{`${loadedIPO.price}`}</a></span>
                                {/* <p>{loadedIPO.price}</p> */}
                            </h3>
                            {ColorPrice(loadedIPO.change, loadedIPO.percent)}
                        </div>
                        <div>
                            <span>Today's Volume: </span>
                            <span>{loadedIPO.volume}</span>
                        </div>
                        <div>
                            <span>
                                {loadedIPO.timestamp}
                            </span>
                        </div>
                        <div key={Symbol+"_in_row_3"}>
                            <p>{"Similar IPOs:  "}{Auth ? similaripos.map(item => {return (<span key={"similar_"+Symbol+"_"+item}><a href={PrefixPage+'/ipos/'+item+'/overview'}>{`${item}    `}</a></span>)}) : <span key={"similar_"+Symbol+"_hiden"}><a href={PrefixPage+'/login'} style={{color: '#566573'}}>{"hiden"}</a></span>}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm d-flex" key={Symbol+"_row_2_records"}>
                    <div className="card card-body flex-fill">
                        <div key={Symbol+"_in_row_1"}>
                            <p>{"Trade started at:   "}{ShowAuth(loadedIPO.StartPrice, (loadedIPO.StartPrice-loadedIPO.OfferPrice)/loadedIPO.OfferPrice, true, "/ipos/"+Symbol+"/historicalquotes")}</p>
                        </div>
                        <div key={Symbol+"_in_row_2"}>
                            {/* {RecordTable(loadedIPO, Symbol)} */}
                            <StylesTable>
                                <Table columns={columns} data={ipodata} key={'data-'+Symbol+'-over'}/>
                            </StylesTable>
                        </div>
                        {/* <div key={Symbol+"_in_row_3"}>
                            <p>{"Similar IPOs:  "}{Auth ? similaripos.map(item => {return (<span key={"similar_"+Symbol+"_"+item}><a href={'/ipos/'+item}>{`${item}    `}</a></span>)}) : <span key={"similar_"+Symbol+"_hiden"}><a href='/login' style={{color: '#566573'}}>{"hiden"}</a></span>}</p>
                        </div> */}
                    </div>
                </div>
            </div>
            

            {/* <Navbar className="justify-content-center" bg="light" expand="lg" >
                <Container>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                        className="mr-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                        >
                            <Nav.Link href={"/ipos/"+Symbol}>Overview</Nav.Link>
                            <Nav.Link href={"/ipos/"+Symbol+"/news"}>News</Nav.Link>
                            <Nav.Link href={"/ipos/"+Symbol+"/comments"}>Comments</Nav.Link>
                            <Nav.Link href={"/ipos/"+Symbol+"/historicalquotes"}>Historical Quotes</Nav.Link>
                            <Nav.Link href={"/ipos/"+Symbol+"/profile"}>Profile</Nav.Link>
                    
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar> */}

            
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs" style={{width: "100%"}}>
                        <li className="nav-item" key={Symbol+"-page-1"}>
                            <a className={"nav-link"+((Subpage==="overview") ? " active":"")} aria-current="page" href={PrefixPage+"/ipos/"+Symbol+"/overview"}>Overview</a>
                        </li>
                        <li className="nav-item" key={Symbol+"-page-2"}>
                            <a className={"nav-link"+((Subpage==="news") ? " active":"")} href={PrefixPage+"/ipos/"+Symbol+"/news"}>News</a>
                        </li>
                        <li className="nav-item" key={Symbol+"-page-3"}>
                            <a className={"nav-link"+((Subpage==="comments") ? " active":"")} href={PrefixPage+"/ipos/"+Symbol+"/comments"}>Comments</a>
                        </li>
                        <li className="nav-item" key={Symbol+"-page-4"}>
                            <a className={"nav-link"+((Subpage==="historicalquotes") ? " active":"")} href={PrefixPage+"/ipos/"+Symbol+"/historicalquotes"}>Historical Quotes</a>
                        </li>
                        <li className="nav-item" key={Symbol+"-page-5"}>
                            <a className={"nav-link"+((Subpage==="profile") ? " active":"")} href={PrefixPage+"/ipos/"+Symbol+"/profile"}>Profile</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row" key={Symbol+"_row_3"}>
                <div className="col-12" key={Symbol+"_3"}>
                    {<WhichSubPage subpage={Subpage} symbol={Symbol} key={Symbol+"__"+Subpage} Auth={Auth} priced={true}/>}
                </div>
            </div>
            
        </div>
    </Styles>
    )

    
}

export default OneIPOPage;
