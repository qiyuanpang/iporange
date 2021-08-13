import {useEffect, useState} from 'react';
import IpoList from '../components/ipos/IpoList';
import redorgreen from "../components/funcs/RedOrGreen";
import SUList from "../components/ipos/SUList";
import UnderwritersList from '../components/ipos/UnderwritersList';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PrefixPage from './Prefix';

const Styles = styled.div`
.center {
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function UnderwriterPage(props) {
    const [underwriter, setUnderwriter] = useState({});
    const [ipos, setIpos] = useState([{}]);
    const params = useParams();
    // const Underwriter = props.Underwriter.underwriter;
    const Auth = (props.User.length > 0) ? true : false;

    useEffect(() => {
        const url = '/api/underwriters/' + params.underwriterurl;
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            setUnderwriter(data.basic);
            setIpos(data.ipos);
        })
    }, [params])
    
    return (
        <Styles>
            <div className="center" key={underwriter.url+'-div-container'}>
                <UnderwritersList title={underwriter.name} items={[underwriter]} key={underwriter.url+"-sulist"} Auth={Auth} prefix={''}/>
                <div className="row" key={underwriter.name+"_row_3"}>
                    <IpoList key={underwriter.name+"-ipos"} ipos={ipos} title={'IPOs underwritten by '+underwriter.name} type='gain' prefix={''}/>
                </div>
            </div>
        </Styles>
    )
}

export default UnderwriterPage;
