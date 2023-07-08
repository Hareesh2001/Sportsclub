import React from 'react'

const CouponsUser = ({coupons}) => {
  return (
    <div>
        <div className='cardAll' >

{coupons.length > 0 ?
    <>
<div style={{width:"900px"}}>
<table class=" table table-bordered table-striped table-hover table-sm table- table-light">
                            <thead class="thead-dark">
                                <tr>
                                   

                                    <th scope="col">Name </th>
                                    <th scope="col">Discount</th>
                                    <th scope="col">Start </th>
                                    <th scope="col">End </th>
                                </tr>
                            </thead>

                            {coupons.map(item => (
                                <tbody>
                                <tr>
                                  

                                    <td scope="col">{item.name} </td>
                                    <td scope="col">{item.discount}</td>
                                    <td scope="col">{item.s_date} </td>
                                    <td scope="col">{item.e_date} </td>
                                   

                                </tr>
                            </tbody>

            ))}

                            
                       
        </table>
</div>

        </>
    :
    <div style={{ height: "72vh" }}><p>No Items are added in Cart</p></div>
}

</div>
    </div>
  )
}

export default CouponsUser
