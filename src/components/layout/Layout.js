import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';
// import { PromiseProvider } from 'mongoose';

function Layout(props) {
    return (
    <div key="div-layout" className="justify-content-center">
      <MainNavigation LoginedUser={props.LoginedUser} key="navigation" onLogout={props.onLogout} onSearch={props.onSearch}/>
      <main className={classes.main} key="nav-main">{props.children}</main>
    </div>
    );
}

export default Layout;