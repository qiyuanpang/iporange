import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import React from 'react';
import styled from 'styled-components';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { Badge } from 'react-bootstrap';
import PrefixPage from '../../pages/Prefix';


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

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    overflow-x: auto;
    min-width: 400px;
    height: 400px;
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

  .pagination {
    padding: 0.5rem;
    float: right;
  }

  .arrow-up {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    
    border-bottom: 5px solid black;
  }
  
  .arrow-down {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    
    border-top: 5px solid black;
  }

  .arrow-updown {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;  
  }
`

function Table({ columns, data, prefix}) {
  // Use the state and functions returned from useTable to build your UI
  // const defaultColumn = React.useMemo(
  //   () => ({
  //     minWidth: 50,
  //     width: 50,
  //     height: 50,
  //     maxWidth: 800,
  //   }),
  //   []
  // )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      // defaultColumn,
    },
    useFilters, useSortBy, usePagination
  )
  
  // useEffect(() => {
  //   // This will now use our custom filter for age
  //   // console.log(StartDate, EndDate)
  //   setFilter("offerdate", [StartDate, EndDate]);
  // }, [StartDate, EndDate]);
  // Render the UI for your table
  return (
    <>
      <div className="pagination">
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50, 100000].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize === 100000 ? 'All' : pageSize}
            </option>
          ))}
        </select>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? <div className="arrow-up"></div>
                      : <div className="arrow-down"></div>
                    : ' '}
                </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    {if (cell.column.Header === 'Symbol') {
                    //   console.log(cell.value)
                        return <td {...cell.getCellProps()}><Link key={cell.value+"-link"} to={prefix+ "/ipos/"+cell.value+"/overview"} >{cell.render('Cell')}</Link></td>
                    } else if (cell.column.Header === 'Offer Return' || cell.column.Header === '1st Day MaxReturn' || cell.column.Header === '1st Week MaxReturn') {
                        return ShowNum(cell.value)
                    } else {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }}
                //   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        
        <span>
          Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '50px' }}
          />
        </span>{'    '}
        <span>
          Page{'    '}
          <strong>
            {pageIndex + 1}/{pageOptions.length}
          </strong>{'    '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'First'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<prev'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'next>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'Last'}
        </button>{' '}
      </div>
    </>
  )
}

function IpoListGainers(props) {
    // const [startdate, setStartDate] = useState("2001-01-01");
    // const [enddate, setEndDate] = useState("2100-01-01");
    const columns = React.useMemo(
        () => [
        {
        Header: "Company",
        accessor: "company"
        },
        {
        Header: "Symbol",
        accessor: "symbol"
        },
        {
        Header: "Offer Date",
        accessor: "offerdate"
        },
        {
        Header: "Offer Price",
        accessor: "offerprice"
        },
        {
        Header: "Start Price",
        accessor: "startprice"
        },
        {
        Header: "Offer Return",
        accessor: "offerreturn"
        },
        {
        Header: "1st Day High",
        accessor: "high_1day"
        },
        {
        Header: "1st Day MaxReturn",
        accessor: "earn_1day"
        },
        {
        Header: "1st Week High",
        accessor: "high_1week"
        },
        {
        Header: "1st Week MaxReturn",
        accessor: "earn_1week"
        }
    ],[]
    );
    // useEffect(() => {
    //     const n = props.ipos.length;
    //     setStartDate(props.ipos[n-1].offerdate)
    //     setEndDate(props.ipos[0].offerdate)
    // }, [props])
    // console.log(props.ipos)
    return (
        <div>          
            <Styles>
                <Table columns={columns} data={props.ipos} key={ Math.floor(Math.random() * 12345576)} prefix={props.prefix}/>
            </Styles>
        </div>
    );
}

export default IpoListGainers;