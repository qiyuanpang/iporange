import {useEffect, useState} from 'react';
import SUList from '../components/ipos/SUList';
import UnderwritersList from '../components/ipos/UnderwritersList';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function AllUnderwritersPage(props) {
    const [allunderwriters, setAllUnderwriters] = useState([{}]);
    let Auth = false;
    if (props.loginedUser.length > 0) {
        Auth = true;
    }
    useEffect(() => {
        fetch('/api/allunderwriters').then(response => {
            return response.json();
        }).then(data => {
            setAllUnderwriters(data);
        })
    }, []);
    // console.log(allunderwriters)
    return (
        <Styles>
            <div className="center" key="allunderwriters-div">
                {/* <SUList title="All Underwriters" items={allunderwriters} key={"allunderwriters-sulist"} SorU={"underwriters"} Auth={Auth}/> */}
                <UnderwritersList title="All Underwriters" items={allunderwriters} key={"allunderwriters-sulist"} Auth={Auth}/>
            </div>
        </Styles>
    )
}

export default AllUnderwritersPage;