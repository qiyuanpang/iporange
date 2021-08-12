import {useEffect, useState} from 'react';
import IpoList from '../components/ipos/IpoList';
import redorgreen from "../components/funcs/RedOrGreen";
import SUList from "../components/ipos/SUList";
import SectorsList from '../components/ipos/SectorsList';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';


const Styles = styled.div`
.center {
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function SectorPage(props) {
    const [sector, setSector] = useState({});
    const [ipos, setIpos] = useState([{}]);
    const params = useParams();
    // const Sector = props.Sector.sector;
    const Auth = (props.User.length > 0) ? true : false;

    useEffect(() => {
        const url = '/api/sectors/' + params.sectorurl;
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            setSector(data.basic);
            setIpos(data.ipos)
        })
    }, [params])
    // console.log(sector, ipos)
    
    return (
        <Styles>
            <div className="center" key={sector.url+'-div-container'}>
                <div className="row" key={sector.name+"__row_2"}>
                    <SectorsList title={sector.name} items={[sector]} key={sector.url+"-sulist"} Auth={Auth} prefix={''}/>
                </div>
                <div className="row" key={sector.url+"_row_3"}>
                    <IpoList key={sector.name+"-ipos"} ipos={ipos} title={'IPOs in '+sector.name} type='gain' prefix={''}/>
                </div>
            </div>
        </Styles>
    )
}

export default SectorPage;