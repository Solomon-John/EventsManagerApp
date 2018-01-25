import React from 'react';
import { Route, Redirect } from 'react-router';
import PropTypes from 'prop-types';


const PrivateRoute = ({
  component: Component,
  authenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const component = <Component {...props} />;
        const redirect = <Redirect to="/SignIn" />;
        if (authenticated === true) {
          return component;
        }
        return redirect;
      }}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired
};
export default PrivateRoute;