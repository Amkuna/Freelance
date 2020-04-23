import React, {useState} from 'react';
import Navbar from './components/Navbar/Navbar';
import FreelancerProfile from './containers/Profile/FreelancerProfile/FreelancerProfile';

import {Switch, Route} from 'react-router-dom';
import Main from './containers/Main';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Register from  './containers/Register/Register';
import Login from './containers/Login';
import RemindPassword from './containers/RemindPassword/RemindPassword';
import ForgotChangePassword from './containers/RemindPassword/ForgotChangePassword';
import BrowseJobs from './containers/BrowseJobs';
import Footer from './components/Footer';
import HeroWrap from './hoc/HeroWrap';
import {AuthContext} from './context/auth';

import Cookies from 'js-cookie';

const App = () => {  
  const authCookie = Cookies.get('access_token');

  const existingTokens = authCookie? JSON.parse(authCookie): undefined;
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    Cookies.set('access_token', data);
    setAuthTokens(data);
  }

  const removeTokens = () => {
    Cookies.remove('access_token');
    setAuthTokens(undefined);
  }


  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens, removeAuthTokens: removeTokens}}>
      <Navbar />
      <HeroWrap>
        <Switch>
          <Route path='/' exact component={Main} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/password-reminder' component={RemindPassword} />
          <Route path='/password/reset/' component={ForgotChangePassword} />
          <Route path='/profile' exact component={FreelancerProfile} />
          <Route path='/profile/:id' component={FreelancerProfile} />
          <Route path='/jobs' component={BrowseJobs} />
          <Route component={PageNotFound} />
        </Switch>
        <Footer />
      </HeroWrap>
    </AuthContext.Provider>
  );
}

export default App;


