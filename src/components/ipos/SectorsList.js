import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import React from 'react';
import styled from 'styled-components';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { Badge } from 'react-bootstrap';
import PrefixPage from '../../pages/Prefix';


function ShowNum(num, Auth) {
  if (Auth) {
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
  } else {
    return (
      <td>
        <Badge bg='light' text='dark' pill>
          <span style={{color: '#566573'}}><a href={PrefixPage+"/login"} style={{color: '#566573'}}>{"hidden"}</a></span>
        </Badge>
      </td>
    )
  }
}

const Styles = styled.div`
  padding: 1rem;
  width: 100%;

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

    .center-header {
      text-align:center;
    }
  }
   
  .center-header {
    text-align:center;
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

function Table1({ columns, data, StartDate, EndDate, prefix, Auth}) {
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
  
  // Render the UI for your table
  return (
    <>
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
                    {if (cell.column.Header === 'Sector') {
                    //   console.log(cell.value)
                        if (cell.value) {
                            // console.log(cell.value.replace('&','').replace(' ','').toLowerCase())
                            return <td {...cell.getCellProps()}><Link key={cell.value+"-link"} to={prefix+"/sectors/"+cell.value.replace('&','').replace(/\s/g,'').toLowerCase()} >{cell.render('Cell')}</Link></td>
                        }
                    } else if (cell.column.Header === 'AVG Offer Return' || cell.column.Header === 'AVG Max Return' ) {
                        return ShowNum(cell.value, Auth)
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

    </>
  )
}


function Table({ columns, data, StartDate, EndDate, prefix, Auth}) {
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
  
  // Render the UI for your table
  return (
    <>
      <div className="pagination" key={prefix+'-div-pagination-1'}>
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
                    {if (cell.column.Header === 'Sector') {
                    //   console.log(cell.value)
                        if (cell.value) {
                            // console.log(cell.value.replace('&','').replace(' ','').toLowerCase())
                            return <td {...cell.getCellProps()}><Link key={cell.value+"-link"} to={prefix+"/sectors/"+cell.value.replace('&','').replace(/\s/g,'').toLowerCase()} >{cell.render('Cell')}</Link></td>
                        }
                    } else if (cell.column.Header === 'AVG Offer Return' || cell.column.Header === 'AVG Max Return' ) {
                        return ShowNum(cell.value, Auth)
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
      <div className="pagination" key={prefix+'-div-pagination-2'}>
        
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



function SectorsList(props) {
    // const [items, setItems] = useState([{}]);
    let items = [{}];
    if (props.items) {
        items = props.items;
    }
    const columns = React.useMemo(
        () => [
          {
              Header: 'Sector',
              accessor: 'name'
          },
          {
            Header: 'Last 3 Months',
            columns: [
              {
                Header: '#IPOs',
                accessor: 'num_3',
              },
              {
                Header: 'AVG Offer Return',
                accessor: 'return_3',
              },
              {
                Header: 'AVG Max Return',
                accessor: 'return_h_3'
              }
            ],
            headerClassName: 'center-header'
          },
          {
            Header: 'Last 6 Months',
            columns: [
              {
                Header: '#IPOs',
                accessor: 'num_6',
              },
              {
                Header: 'AVG Offer Return',
                accessor: 'return_6',
              },
              {
                Header: 'AVG Max Return',
                accessor: 'return_h_6'
              }
            ],
            headerClassName: 'center-header'
          },
          {
            Header: 'Last 12 Months',
            columns: [
              {
                Header: '#IPOs',
                accessor: 'num_12',
              },
              {
                Header: 'AVG Offer Return',
                accessor: 'return_12',
              },
              {
                Header: 'AVG Max Return',
                accessor: 'return_h_12'
              }
            ],
            headerClassName: 'center-header'
          }
        ],
        []
      )
    if (items.length > 1) {
      return (
          <div>
              <h3 className='title' text-align='center' fontFamily='arial, sans-serif'>
                  {props.title}
              </h3>
              <Styles>
                  <Table columns={columns} data={items} key={"sulist-sectors-"+Math.floor(Math.random() * 13254)} Auth={props.Auth} prefix={props.prefix}/>
              </Styles>
          </div>
      );
    } else {
      return (
        <div>
            <h3 className='title' text-align='center' fontFamily='arial, sans-serif'>
                <a href={PrefixPage+'/sectors'}>{"Sectors"}</a>{' > '+props.title}
            </h3>
            <Styles>
                <Table1 columns={columns} data={items} key={"sulist-sectors-"+Math.floor(Math.random() * 13254)} Auth={props.Auth} prefix={props.prefix}/>
            </Styles>
        </div>
    );
    }
}

export default SectorsList;
