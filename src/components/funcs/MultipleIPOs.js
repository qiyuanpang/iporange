import {Route} from 'react-router-dom';
import OneIPOPage from '../../pages/OneIPO';
import {Fragment} from 'react';

function MultipleIPOsPage(props, user){
    return props.map( (item) => {
      const {symbol, subpage} = item;
      return (
          <Route path={"/ipos/"+symbol+"/"+subpage} exact key={"route-"+symbol+"-"+subpage}>
              <OneIPOPage Symbol={symbol} Subpage={subpage} key={symbol+"-"+subpage} User={user} priced={true}/>
          </Route>
      )      
    })
}

export default MultipleIPOsPage;