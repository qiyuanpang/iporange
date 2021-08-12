import {Route} from 'react-router-dom';
import UpcomingOneIPOPage from '../../pages/UpcomingOneIPO';
import {Fragment} from 'react';

function MultipleUpcomingIPOsPage(props, user){
    return props.map( (item) => {
      const {symbol, subpage} = item;
      return (
          <Route path={"/ipos/"+symbol+"/"+subpage} exact key={"route-"+symbol+"-"+subpage}>
              <UpcomingOneIPOPage Symbol={symbol} Subpage={subpage} key={symbol+"-"+subpage} User={user} priced={false}/>
          </Route>
      )      
    })
}

export default MultipleUpcomingIPOsPage;