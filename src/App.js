import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Backend_url from './Config'
import Sidebar from './components/sidebar/Sidebar'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import Products from './components/products/Products'
import Event from './components/products/Event'
import Coupons from './components/products/Coupon'
import Cart from './components/products/Cart'
import Product from './components/products/Product'
import Orders from './components/products/Orders'
import Home from './components/Home'
import './App.scss'
import CouponsUser from './components/products/CouponsUser'

function App() {


  // USED TO USER AUTHENTICATION TO CHECK THE USER IS PRESENT AND WHO IS THAT ONE ADMIN OR USER 
  const [authTrigger, setAuthTrigger] = useState(false)
  const [login_or_not, setLoginOrNot] = useState(false)
  const [who_am_i, setWhoAmI] = useState('')
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setLoginOrNot(true)
      setWhoAmI(JSON.parse(localStorage.getItem('user')).role)
    }
    else {
      setLoginOrNot(false)
    }
  }, [authTrigger])





  const [coupons, setCoupons] = useState([])
  const [couponTrigger,setCouponTrigger] = useState(false)
  useEffect(() => {
    axios.get(`${Backend_url}/coupons`).then(res => {
      setCoupons(res.data)
    })
  }, [couponTrigger])




 

  const [eventDetails, setEventDetails] = useState([])

  const [eventTrigger, setEventTrigger] = useState(false)
  useEffect(() => {

    axios.get(`${Backend_url}/event`).then(res => {

      setEventDetails(res.data)
    })
  }, [eventTrigger])

  const deleteEvent = () => {
    if (window.confirm('Do you want to delete the event')) {
      axios.delete(`${Backend_url}/events/delete/${eventDetails[0].id}`).then(res => {
       
        setEventTrigger(!eventTrigger)
        window.location.reload()
      })
    }
  }
  const [userDetails, setUserDetails] = useState('')
  const [userTrigger,setUserTrigger] = useState(false)
  useEffect(() => {
      
      if (localStorage.getItem('user')) {
          setUserDetails(JSON.parse(localStorage.getItem('user')))
      }
      else{
          setUserDetails("")
      }
  }, [userTrigger])
  return (
     <div  
    style={{backgroundImage:"url(https://capovelo.com/wp-content/uploads/2016/06/taku-bannai-illustrations_urbancycling_4.jpg)",backgroundSize:"cover"}}
     >
      <BrowserRouter>
        <div className="home" style={{display:"flex"}}>
          <Sidebar logined={login_or_not} setAuthTrigger={setAuthTrigger} cart={1} who_am_i={who_am_i} userDetails={userDetails}/>
          <div className="homeContainer">
          {/* <h2 style={{marginLeft:"28px"}}>RSP_PASTRIES</h2> */}
            <div style={{ padding: "10px" }}>
              <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/products" element={<Products authTrigger={authTrigger} who_am_i={who_am_i} eventTrigger={eventTrigger} setEventTrigger={setEventTrigger} eventDetails={eventDetails} />}></Route>
              {login_or_not === false &&
          <>
            <Route path="/login" element={<Login setAuthTrigger={setAuthTrigger} userTrigger={userTrigger} setUserTrigger={setUserTrigger} />}></Route>
           
            <Route path="/signup" element={<Signup setAuthTrigger={setAuthTrigger} />}></Route>
          </>

        }
        {who_am_i === 'admin' && <Route path="/events" element={<Event  authTrigger={authTrigger} who_am_i={who_am_i} eventTrigger={eventTrigger} setEventTrigger={setEventTrigger} eventDetails={eventDetails}/>}></Route>}
        {who_am_i === 'admin' && <Route path="/coupons/:id" element={<Coupons authTrigger={authTrigger} who_am_i={who_am_i} eventTrigger={eventTrigger} setEventTrigger={setEventTrigger} eventDetails={eventDetails}/>}></Route>}   
        {who_am_i === 'user' && <Route path="/cart" element={<Cart coupons={coupons} />}></Route>}
        {who_am_i === 'user' && <Route path="/product/:id" element={<Product coupons={coupons} />}></Route>}
        {who_am_i === 'user' && <Route path="/orders" element={<Orders />}></Route>}
        {who_am_i === 'user' && <Route path="/couponUs" element={<CouponsUser coupons={coupons} />}></Route>}
              </Routes>
            </div>
          </div>
        </div> 
      </BrowserRouter>
    </div>
  );
};

  

export default App;
