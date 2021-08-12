import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 35%;
    padding: 10px;
}
`

function ListItem(props) {
    return props.map(item => {
        const {text, url, section} = item;
        return (
            <li className="list-group-item" key={"list-group-item"+Math.floor(Math.random() * 65974862).toString()}>
                <span style={{color: '#5D6D7E'}}>{section}<a href={url}>{`:   ${text}`}</a></span>
            </li>
        )
    })
}

function SearchResultsPage(props) {
    const results = props.input;
    if (results) {
        return (
            <Styles>
                <div className="center container" key={"search-results-mainbody"}>
                    <ul className="list-group" key={"search-results-list"+Math.floor(Math.random() * 47894341).toString()}>
                        {ListItem(results)}
                    </ul>
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