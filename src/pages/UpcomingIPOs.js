import { useState, useEffect } from 'react';
import UpcomingIPOsList from '../components/ipos/UpcomingIPOsList';
import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function UpcomingIPOsPage() {
    const [isUpcomingipos, setIsUpcomingIPOs] = useState(true);
    const [upcomingipos, setUpcomingIPOs] = useState([{}]);

    useEffect(() => {
        setIsUpcomingIPOs(true);
        fetch("/api/upcomingipos").then(response => {
            // console.log(typeof(response), response)
            return response.json();
        }).then(data => {
            setUpcomingIPOs(data);
        });
        setIsUpcomingIPOs(false);
    }, []);
    
    if (isUpcomingipos) {
        return (
            <section>
                <p>Loading...</p>
            </section>
        )
    }
    // console.log('what',typeof(loadedIpos), loadedIpos.length, loadedIpos[0])
    
    // console.log(upcomingipos)
    return (
        <Styles>
            <div className="center" key='upcomingipos-b4List'>
                <UpcomingIPOsList items={upcomingipos} title='Upcoming IPOs' key="upcomingiposlist" />
           </div>
        </Styles>

    )
}

export default UpcomingIPOsPage;