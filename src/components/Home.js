import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Backend_url from '../Config'
import Meta from 'antd/es/card/Meta'
import { Card, Carousel } from 'antd'


const contentStyle = {
  height: '70vh',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',

};

const Home = () => {
  const navigate = useNavigate()

  const [AllCat, setCat] = useState([])
  const [images, setimages] = useState([])
  useEffect(() => {
    axios.get(`${Backend_url}/products`).then(res => {

      setCat(res.data)
      res.data.map((r, index) => {

        setimages(prev => [...prev, r.images])


      })

    })
  }, [])



  return (
    <div>



      <div class='image' style={{ display: "flex",justifyContent: "center", alignItems: "center",height: "97vh",width : "150vh",flexDirection: "column"}}>
        <img src="https://mumbrella.com.au/wp-content/uploads/2019/06/iStock-949190756-e1561510622966.jpg" style={{borderRadius: "0%", height:"103%", width:"158%"}} 
        alt="" /> 
        <div style={{  position:"absolute", color:"white",fontSize: "40px", fontWeight: "800" }}> SportsClub Where Chapmpions Are Made 🏆</div>


    </div>


     


      {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'user' && <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {AllCat.map((p, index) => (

          <Card
            style={{ width: 300, boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)" }}
            cover={
              <img
                alt="example"
                src={p.images}
                height={150}
                width={100}
                style={{ objectFit: "contain" }}

              />
            }

          >
            <Meta

              title=<div style={{ display: "flex", justifyContent: "space-between", alignps: "center", width: "180px", marginLeft: "px" }}>  <div> {p.name}</div>  <div>&#8377;{p.cost}</div></div>



            />





          </Card>
        ))}
      </div>}







      {/* REMOVE IF YOU WANT */}

      {/* <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {AllCat.map((p, index) => (

          <Card
            style={{ width: 300, boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)" }}
            cover={
              <img
                alt="example"
                src={p.images}
                height={150}
                width={100}
                style={{ objectFit: "contain" }}

              />
            }

          >
            <Meta

              title=<div style={{ display: "flex", justifyContent: "space-between", alignps: "center", width: "180px", marginLeft: "28px" }}>  <div> {p.name}</div>  <div>&#8377;{p.cost}</div></div>



            />





          </Card>
        ))}
      </div> */}





      
    </div>
  )
}

export default Home