import {useEffect, useState} from 'react';
import SectorsList from '../components/ipos/SectorsList';
import SUList from '../components/ipos/SUList';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function AllSectorsPage(props) {
    const [allsectors, setAllSectors] = useState([{}]);
    let Auth = false;
    if (props.loginedUser.length > 0) {
        Auth = true;
    }
    useEffect(() => {
        fetch('/api/allsectors').then(response => {
            return response.json();
        }).then(data => {
            // console.log(data)
            setAllSectors(data);
        })
    }, []);
    return (
        <Styles>
            <div className="center" key="allsectors-div">
                {/* <SUList title="All Sectors" items={allsectors} key={"allsectors-sulist"} SorU={"sectors"} Auth={Auth}/> */}
                <SectorsList title="All Sectors" items={allsectors}  key={"allsectors-sulist"} Auth={Auth}/>
            </div>
        </Styles>
    )
}

export default AllSectorsPage;