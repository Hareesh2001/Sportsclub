import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Backend_url from '../../Config'
import CardIndi from './CartIndi'

const Orders = () => {

  const [buyedDetails, setBuyedDetails] = useState([])
  useEffect(() => {
    axios.get(`${Backend_url}/orders`).then(res => {
      if (res.data.length === 0) {
        setBuyedDetails([])
      }
      else {
        setBuyedDetails(res.data.filter(d => {
         return d.email === JSON.parse(localStorage.getItem('user')).email

          
        }))

      }
    })
  }, [])
  return (
    <div>

<h1 style={{ marginLeft: "20px" }}>My Orders</h1>

      <div className='cardAll' style={{display:"flex",flexDirection:"column"}}>

        {buyedDetails.length > 0 ?

          <div style={{width:"900px"}}>
                <table class=" table table-bordered table-striped table-hover table-sm table- table-light">
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col">Product</th>

                                                    <th scope="col">Name </th>
                                                    <th scope="col">cost</th>
                                                    <th scope="col">count </th>
                                                    
                                                </tr>
                                            </thead>

                                            {buyedDetails.map(item => (
                                                <tbody>
                                                <tr>
                                                    <td scope="col"><img
                                                        alt="example"
                                                        src={item.images}
                                                        height={50} width={50}
                                                    /></td>

                                                    <td scope="col">{item.name} </td>
                                                    <td scope="col">{item.cost}</td>
                                                    <td scope="col">{item.count} </td>
                                                  

                                                </tr>
                                            </tbody>

                            ))}

                                            
                                       
                        </table>
                </div>
       
        
          :
          <div style={{ height: "64vh" }}><p>No Items are  in Your order</p></div>
        }

      </div>
    </div>
  )
}

export default Orders