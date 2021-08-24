// import { PromiseProvider } from 'mongoose';
import { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import IpoList from '../components/ipos/IpoList';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 70%;
    padding: 10px;
}
`

function AllIPOsPage(props) {
    const [isLoadingAllIPOs, setIsLoadingAllIPOs] = useState(true);
    const [loadedAllIPOs, setLoadedAllIPOs] = useState([{}]);
    const history = useHistory();
    history.push('/ipos')
    useEffect(() => {
        setIsLoadingAllIPOs(true);
        fetch("/api/ipos/all").then(response => {
            // console.log(typeof(response), response)
            return response.json();
        }).then(data => {
            setLoadedAllIPOs(data);
        });
        setIsLoadingAllIPOs(false);
    }, []);
    
    if (isLoadingAllIPOs) {
        return (
            <section>
                <p>Loading...</p>
            </section>
        )
    }
    // console.log('what',typeof(loadedIpos), loadedIpos.length, loadedIpos[0])
    

    return (
        <Styles>
            <div className="center" key="allipos-div-1">
                {/* <h1>All IPOs Page</h1> */}
                <IpoList ipos={loadedAllIPOs} title='Priced IPOs' key="alliposlist" type="gain" prefix={""}/>
            </div>
        </Styles>

    )
}

export default AllIPOsPage;
