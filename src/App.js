import './App.css';
import Header from './Header';
import Home from './Home';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import {react,useEffect} from "react";
import { auth } from './firebase';
import {useStateValue} from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const  promise=loadStripe( "pk_test_51HPvU9DFg5koCdLGJJbNo60QAU99BejacsvnKvT8xnCu1wFLCuQP3WBArscK3RvSQmSIB3N0Pbsc7TtbQiJ1vaOi00X9sIbazL");
function App() {
       const[{},dispatch]=useStateValue();
       
     useEffect(() => {
            
 
         auth.onAuthStateChanged(authUser => {
          console.log('THE USER IS >>> ',authUser);  
          if(authUser){

            dispatch({
              type: 'SET_USER',
              user: authUser
            })
          }
          else{
            dispatch({
              type: 'SET_USER',
              user: null
             })
           }

        })
      
     }, [])

  return ( 
    <Router>
    <div className="app">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/checkout">
          <Header/>
          <Checkout/>
       </Route>
       <Route path="/payment">
          <Header/>
          <Elements stripe={promise}>
          <Payment/>
          </Elements>
          <Payment/>
          <h1>I am the payment route</h1>
       </Route>
       <Route path="/">
       <Header/>
          <Home/>
       </Route>
       </Switch>
    </div>
    </Router>
  );
}

export default App;
