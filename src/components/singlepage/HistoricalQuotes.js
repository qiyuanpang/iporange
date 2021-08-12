import { useEffect, useState } from "react";
import React from 'react';
import styled from 'styled-components';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';


const Styles = styled.div`
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

function Table({ columns, data, StartDate, EndDate }) {
  // Use the state and functions returned from useTable to build your UI
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
    },
    useFilters, useSortBy, usePagination
  )
  
  useEffect(() => {
    // This will now use our custom filter for age
    // console.log(StartDate, EndDate)
    setFilter("date", [StartDate, EndDate]);
  }, [StartDate, EndDate]);
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
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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

// function OneQuote(props, symbol) {
//     return props.map((item, index) => {
//         return (
//             <tr key={symbol+"-quotes-table-item-"+Math.floor(Math.random() * Math.random() * 100000000).toString()}>
//                 <td>{item.date}</td>
//                 <td>{item.open}</td>
//                 <td>{item.high}</td>
//                 <td>{item.low}</td>
//                 <td>{item.close}</td>
//                 <td>{item.volume}</td>
//             </tr>
//         )
//     })
// }

const customFilterFunction = (rows, id, Dates) =>
  rows.filter((row) => {
    // console.log(StartDate, EndDate)
    if (row.original.date >= Dates[0]) {
      if (row.original.date <= Dates[1]) {
        return row
      }
    }
  });

function HistoricalQuotes(props) {
    const [quotes, setQuotes] = useState([{}]);
    const [startdate, setStartDate] = useState("2001-01-01");
    const [enddate, setEndDate] = useState("2100-01-01");
    const Symbol = props.symbol;
    const priced = props.priced;
    const columns = React.useMemo(
        () => [
        {
        Header: "Date",
        accessor: "date",
        filter: customFilterFunction
        },
        {
        Header: "Open",
        accessor: "open"
        },
        {
        Header: "High",
        accessor: "high"
        },
        {
        Header: "Low",
        accessor: "low"
        },
        {
        Header: "Close",
        accessor: "close"
        },
        {
        Header: "Volume",
        accessor: "volume"
        }
    ],[]
    );
    useEffect(() => {
        if (priced) {
          const url = '/api/quotes/' + Symbol;
          fetch(url).then(response => {
              return response.json();
          }).then(data => {
              setQuotes(data.quotes);
              // console.log(data.quotes[0].date)
              setStartDate(data.quotes[0].date);
              setEndDate(data.quotes[data.quotes.length-1].date)

          })
        }
    },[])
    return (
        <Styles>
            <span>{"From "}</span>
            <input
              type="date"
              value={startdate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
            <span>{"  To "}</span>
            <input
              type="date"
              value={enddate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
            <Table columns={columns} data={quotes} StartDate={startdate} EndDate={enddate} key={Symbol+'-historicalquotes'}/>
        </Styles>
    )
    // return (
    //     <table id="quotes" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%" key={props.symbol+"-quotes-body"}>
    //         <thead key={props.symbol+"-quotes-table-header"}>
    //             <tr key={props.symbol+"-quotes-table-header-details"}>
    //                 <th className="th-sm">Date</th>
    //                 <th className="th-sm">Open</th>
    //                 <th className="th-sm">High</th>
    //                 <th className="th-sm">Low</th>
    //                 <th className="th-sm">Close</th>
    //                 <th className="th-sm">Volume</th>
    //             </tr>
    //         </thead>
    //         <tbody key={props.symbol+"-quotes-table-body"}>
    //             {OneQuote(quotes, Symbol)}
    //         </tbody>
    //     </table>


    // )
}

export default HistoricalQuotes;