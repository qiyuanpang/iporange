import UnderwriterPage from "../../pages/Underwriter";
import {Route} from 'react-router-dom';

function MultipleUnderwritersPage(props, user) {
    return props.map(item => {
        return (
            <Route path={'/underwriters/'+item.url} key={"route-"+item.underwriter+"-underwriter"}>
                <UnderwriterPage Underwriter={item} key={item.underwriter+"-underwriter"} User={user}/>
            </Route>
        )
    })
} 

export default MultipleUnderwritersPage;