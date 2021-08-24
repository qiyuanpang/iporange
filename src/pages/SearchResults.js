import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import React from 'react';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import styled from 'styled-components';
import PrefixPage from './Prefix';

const Styles = styled.div`
  padding: 1rem;

  .center {
    margin: auto;
    width: 40%;
    padding: 10px;
  }

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

`


function Table({ columns, data, cate, prefix}) {
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
    setFilter("section", cate);
  }, [cate]);
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
                {/* <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? <div className="arrow-up"></div>
                      : <div className="arrow-down"></div>
                    : ' '}
                </span> */}
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
                    {if (cell.column.Header === 'Category') {
                    //   console.log(cell.value)
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    } else if (cell.column.Header === 'Result') {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    } else if (cell.column.Header === 'Link') {
                        return <td {...cell.getCellProps()}><Link key={cell.value+"-link"} to={prefix+cell.value} >{'more..'}</Link></td>
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

const customFilterFunction = (rows, id, Cate) =>
  rows.filter((row) => {
    // console.log(StartDate, EndDate)
    if (row.original.section === Cate) {
        //   console.log(row.original.offerdate, Dates)
        return row
    }
  });

function ListItem(props) {
    return props.map(item => {
        const {text, url, section} = item;
        return (
            <li className="list-group-item" key={"list-group-item"+Math.floor(Math.random() * 65974862).toString()}>
                <span style={{color: '#5D6D7E'}}>{section}<a href={PrefixPage+url}>{`:   ${text}`}</a></span>
            </li>
        )
    })
}

function SearchResultsPage(props) {
    const results = props.input;
    const [cate, setCate] = useState('Stock')
    const columns = React.useMemo(
        () => [
        {
        Header: "Category",
        accessor: "section",
        filter: customFilterFunction
        },
        {
        Header: "Result",
        accessor: "text"
        },
        {
        Header: "Link",
        accessor: "url"
        }
    ],[]
    );
    // console.log(results)
    if (results.length > 0) {
        return (
            // <Styles>
            //     <div className="center container" key={"search-results-mainbody"}>
            //         <ul className="list-group" key={"search-results-list"+Math.floor(Math.random() * 47894341).toString()}>
            //             {ListItem(results)}
            //         </ul>
            //     </div>
            // </Styles>
            <Styles key={"search-results-mainbody"}>
                <div className='center container'>
                    <select
                        value={cate}
                        onChange={e => {
                        setCate(e.target.value)
                        }}
                    >
                        {['Stock', 'Underwriter', 'Sector'].map(num => (
                        <option key={'search-cate-'+num} value={num}>
                            {num}
                        </option>
                        ))}
                    </select>
                    <Table columns={columns} data={results} cate={cate} key={ 'search-results-'+Math.floor(Math.random() * 12345576).toString()} prefix={''}/>
                </div>
            </Styles>
        )
    } else {
        return (
            <Styles>
                <div className="center container" key="search-no-results">
                    <div>{"No results match your input! Please try again!"}</div>
                </div>
            </Styles>
        )
    }
}

export default SearchResultsPage;