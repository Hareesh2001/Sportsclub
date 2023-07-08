import "./sidebar.scss";


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ logined, setAuthTrigger, cart, who_am_i, eventDetails, userDetails }) => {
  const [cross, setCross] = useState("bar");

  const handleClick = (e) => {
    if (cross === "bar") {
      document.querySelector(".sidebar").style.width = "180px";
      document.querySelector("#checkbox").checked = true;
      setCross("cross");
    } else {
      document.querySelector("#checkbox").checked = false;
      setCross("bar");
      document.querySelector(".sidebar").style.width = "50px";
      const sides = document.querySelectorAll(".itemD");
      for (let i = 0; i < sides.length; i++) {
        sides[i].classList.remove("itemC_dis");
      }
    }
    navigate('/')
  };

  const handle = (e) => {
    if (cross === "bar") {
      document.querySelector(".sidebar").style.width = "180px";
      document.querySelector("#checkbox").checked = true;
      setCross("cross");
    }

    const all = document.querySelectorAll(".expand");

    for (let i = 0; i < all.length; i++) {


      all[i].classList.remove("expandDis");

    }
    //  const sides = document.querySelectorAll('.side')
    //  for(let i=0;i<sides.length;i++){

    //   sides[i].classList.toggle('dis')

    //  }
  };
  const handleB = (e) => {
    document.querySelector("#checkbox").checked = false;
    setCross("bar");
    document.querySelector(".sidebar").style.width = "50px";
    const sides = document.querySelectorAll(".itemD");
    for (let i = 0; i < sides.length; i++) {
      sides[i].classList.remove("itemC_dis");
    }
  };

  //  document.querySelector(".sidebar").addEventListener('mouseleave',handleB)



  const designHandle = (e) =>{
    
    const allD = document.querySelectorAll('.designDis')
    for(let i=0;i<allD.length;i++){
      allD[i].classList.remove('designDis')
    }
    e.target.classList.add('designDis')
  }
  const navigate = useNavigate();
  return (
    <div
      className="sidebar"
      style={{ color: "yellow", background: "radial-gradient(circle at 12.3% 19.3%, rgb(119,136,153) 0%, rgb(119,136,153) 100.2%)"}}
      // onMouseOver={(e) => {
      //   handle(e);
      // }}
      // onMouseLeave={handleB}
    >
      <div className="navF">
       
      <span onClick={e => { navigate('/') }} style={{cursor:"pointer",margin:"10px",marginTop:"15px"}}>
           
           <img src="https://gretavalleyrelay.files.wordpress.com/2019/07/the-sport-shop-logo.png" width={80} height={80} style={{borderRadius:"50%",marginLeft:"5px",marginTop:"10px"}} alt="" />
           {localStorage.getItem('user')&& <div style={{marginLeft:"15px",marginTop:"5px"}}>Hello_{localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).name.slice(0,7):""}</div>}
         </span>
        <div className="">
          <ul>
          
          {logined===false ?
            <li
              onClick={(e) => {
                designHandle(e)
                navigate("/login");
              }}
            >
              
              <span className="side">Login</span>
            </li>
            :

              <>
              <li 
              onClick={(e) => {
                designHandle(e)
                navigate("/products");
              }}
            >
              
              <span className="side">Products</span>
            </li>
            {who_am_i==='admin' ? <>
            <li
              onClick={(e) => {
                designHandle(e)
                navigate("/events");
              }}
            >
              
              <span className="side">Event</span>
            </li>
           
            </>
            :
            <>
              
            <li
              onClick={(e) => {
                designHandle(e)
                navigate("/cart");
              }}
            >
              
              <span className="side">Cart</span>
            </li>






            <li onClick={(e) => {
designHandle(e)
              navigate("/orders");
            }}>

              
              <span className="side">Orders</span>
            </li>
            <li onClick={(e) => {
              designHandle(e)
              navigate("/couponUs");
            }}>

              
              <span className="side">Coupons</span>
            </li>
            </>
            }
            
            {who_am_i==='user' &&<li >

            <span className="side"> <a href="mailto:ajayputta096@gmail.com" style={{color:"white"}}>Help<i class="fa-solid fa-envelope" style={{marginLeft:"5px"}}></i></a></span>
            
            </li>}

            <li onClick={() => {
             if(window.confirm('Do you want to logout?')){
              if (localStorage.getItem('user')) {
                localStorage.removeItem('user')
               
                navigate("/login");
                window.location.reload()
              }
             }

            }}>

             
              <span className="side">Logout</span>
            </li>

              </>
          }



          </ul>
        </div>
       
      </div>
    </div>
  );
};

export default Sidebar;