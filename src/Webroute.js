import React, { Component } from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom'
import HomeComponent from './components/HomeComponent'
import PackageComponent from './components/product/PackageComponent'
import ProductsComponent from './components/product/ProductsComponent'
import ThemeDestinationComponent from './components/ThemeDestinationComponent'
import WishListComponent from './components/user/WishListComponent'
import LoginComponent from './components/login/LoginComponent'
import ForgetPassword from './components/login/ForgetPassword'
import ResetPassword from './components/login/ResetPassword'
import SignupComponent from './components/login/SignupComponent'
import OrderManagementComponent from './components/OrderManagementComponent'
import orderDetailsComponent from './components/orderDetailsComponent'
import BookingComponent from './components/booking/BookingComponent'
import BookingViewComponent from './components/booking/BookingViewComponent'
import BookingEditComponent from './components/booking/BookingEditComponent'
import CreateBookingComponent from './components/booking/CreateBookingComponent'
import UserProfileComponent from './components/user/UserProfileComponent'
import EditCardComponent from './components/user/EditCardComponent'
import AddUserCardComponent from './components/user/AddUserCardComponent'
import EditProfileComponent from './components/user/EditProfileComponent'
import SearchBookingComponent from './components/SearchBookingComponent'
import NotificationComponent from './components/user/NotificationComponent'
import AddCardComponent from './components/card/AddCardComponent'
import ChangePasswordComponent from './components/user/ChangePasswordComponent'
import OrderComponent from './components/order/OrderComponent'
import SearchResultComponent from './components/product/SearchResultComponent'
import LoginLayout from './LoginLayout'
import HomeLayout from './HomeLayout'
import InnerLayout from './InnerLayout'
import connect from "react-redux/es/connect/connect";
import {
   setCustomer,setloginUser,getloginUser
} from './actions/AuthAction';
import { convertToSlug,getUrl} from './constants.js'
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route {...rest} render={props => {
      return <Layout history={props.history}>
        <Component {...props} />
      </Layout>

  }} />

);

const AuthRoute = ({ component: Component,  session:session, customer:customer,  layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
    
    session.authenticated==true && session.user != undefined ? (
                <Layout history={props.history}>
                    <Component {...props} />
                  </Layout>
              ) : (
              <Redirect to={{
                            pathname: getUrl(customer)+"login",
                          }}
                        />
              )
    
  )}/>
);

const mapStateToProps = state => {
  return {
    user: state.user,
    session: state.session,
    customer: state.Auth.customer,
    Auth: state.Auth,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
     setCustomer: (customer) => dispatch(setCustomer(customer)),
     setloginUser: (customer) => dispatch(setloginUser(customer)),
     getloginUser: () => dispatch(getloginUser()),
  };
}

class Webroute extends Component {
  constructor (props) {
    super(props)

    this.state = {
      flag:true
    }

  }

  componentWillMount() {

    var parent = this;
    setTimeout(function() {
      parent.props.setloginUser()
       parent.setState({flag:false});
      
    }, 500);

    setTimeout(function() {
      if(parent.Auth != undefined && parent.Auth.user != undefined && parent.Auth.user.id != undefined) {

      } else {
         parent.props.getloginUser();
      }
    }, 1000);
    
      
  }


  render () {
    if(this.state.flag) {
      return'';
    }
    const { session,customer } = this.props;
    return (
        <Switch>
          <AppRoute exact path='/login' component={LoginComponent} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/forget' component={ForgetPassword} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/' component={HomeComponent} layout={HomeLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/packages/search' component={SearchResultComponent} layout={InnerLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/varify-email' component={HomeComponent} layout={HomeLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/login' component={LoginComponent} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/forget' component={ForgetPassword} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/reset-forgot-password/:token' component={ResetPassword} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/signup' component={SignupComponent} layout={LoginLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/themedestination' component={ThemeDestinationComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/wishlist' component={WishListComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/order' component={OrderManagementComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:package_id/create-order' component={orderDetailsComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/bookings' component={BookingComponent} layout={InnerLayout} session={session} customer={customer} />
            <AuthRoute exact path='/:customer?/:id/create-booking' component={CreateBookingComponent} layout={InnerLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/search' component={SearchBookingComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/notification' component={NotificationComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:id/booking-view' component={BookingViewComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:id/booking-edit' component={BookingEditComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:id/create-booking' component={CreateBookingComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/user-profile' component={UserProfileComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/add-user-card' component={AddUserCardComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:id/edit-card' component={EditCardComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/edit-profile' component={EditProfileComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:id/add-card' component={ AddCardComponent } layout={ InnerLayout } session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/change-password' component={ ChangePasswordComponent } layout={ InnerLayout } session={session} customer={customer} />
          <AppRoute exact path='/:customer?/product/:product_type' component={ProductsComponent} layout={InnerLayout} session={session} customer={customer} />
          <AuthRoute exact path='/:customer?/:order_id/order-details' component={OrderComponent} layout={InnerLayout} session={session} customer={customer} />
          <AppRoute exact path='/:customer?/:id/:title' component={PackageComponent} layout={InnerLayout} session={session} customer={customer} />
        </Switch>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Webroute))