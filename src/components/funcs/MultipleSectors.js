import SectorPage from "../../pages/Sector"
import {Route} from 'react-router-dom';

function MultipleSectorsPage(props, user) {
    return props.map(item => {
        return (
            <Route path={'/sectors/'+item.url} key={"route-"+item.sector+"-sector"}>
                <SectorPage Sector={item} key={item.sector+"-sector"} User={user}/>
            </Route>
        )
    })
} 

export default MultipleSectorsPage;