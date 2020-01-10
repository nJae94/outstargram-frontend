import React from 'react';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import Auth from "../Routes/Auth";
import Feed from "../Routes/Feed";

const LoggedInRoutes = () => <><Route exact path="/" component={Feed} /> </>

const LoggedOutRoutes = () => <><Route exact path="/" component={Auth} /> </>

const AppRouter = ({isLoggedIn})=> 
<Router>
    <Switch>
        {isLoggedIn ? <LoggedInRoutes/> : <LoggedOutRoutes/>}
    </Switch>

</Router>

Router.PropTypes = {
    isLoggedIn: PropTypes.bool.isRequired
}

export default AppRouter;