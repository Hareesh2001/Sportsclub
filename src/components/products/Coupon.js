import React from 'react'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Backend_url from '../../Config'
import { Modal } from 'antd'

const Coupon = () => {
    const { id } = useParams()
    const [events, setEvents] = useState([])
    
    const [eventT, setEventT] = useState(false)
    useEffect(() => {
        axios.get(`${Backend_url}/events/${id}`).then(res => {
           console.log(res.data)
            setEvents(res.data)
        })
    }, [id, eventT])


    const deleteCoupon = (id) => {
        axios.delete(`${Backend_url}/coupons/${id}`).then(res => {
            window.alert("Coupon has been deleted")
            setEventT(!eventT)
        })

    }

    const [showAddModal, setShowAddModal] = useState(false);
    const [AddingSingleCoupon, setAddingSingleCoupon] = useState({
        "name": "",
        "discount": "",



    })
    const [btnProps, setBtnProps] = useState(true)

    useEffect(() => {
        if (AddingSingleCoupon.name !== "" && AddingSingleCoupon.discount !== '' && AddingSingleCoupon.event !== '') {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [AddingSingleCoupon.discount, AddingSingleCoupon.event, AddingSingleCoupon.name])





    const adding = () => {
       
        axios.post(`${Backend_url}/events`, {
            "id":id,
            "name": events.name,
           
            "s_date": events.s_date,
            "e_date": events.e_date,
            "coupon": [...events.coupon,
                {...AddingSingleCoupon,"s_date":events.s_date,"e_date":events.e_date}
            ]

        }).then(res => {
            setEventT(!eventT)
            setShowAddModal(false)
            setAddingSingleCoupon({
                "name": "",

                "discount": "",
            })
           
        }).catch(err => {
            window.alert(err)
            setAddingSingleCoupon({
                "name": "",
                "discount": "",


            })
            setShowAddModal(false);
           
        })

    }
    const [showAddModal2, setShowAddModal2] = useState(false);



    const [couponId,setCouponId] = useState('')
    const EditCoupon = (id) =>{
        setCouponId(id)
        axios.get(`${Backend_url}/coupons/${id}`).then(res=>{
            setAddingSingleCoupon({
                "name": res.data.name,
                "discount": res.data.discount,
                "s_date":res.data.s_date,
                "e_date":res.data.e_date



            })
            setShowAddModal2(true)
        })

    }

    const update =()=>{
        axios.put(`${Backend_url}/coupons`,{
            "id":couponId,
            "name": AddingSingleCoupon.name,
            "discount": AddingSingleCoupon.discount,
            "s_date":AddingSingleCoupon.s_date,
            "e_date":AddingSingleCoupon.e_date
        }).then(res=>{
            
            setAddingSingleCoupon({
                "name": res.data.name,
                "discount": res.data.discount,


            })
            window.alert("Coupon has been updated")
            setEventT(!eventT)
            setShowAddModal2(false)
        })



    }
    return (
        <div>
        <h1 style={{marginLeft:"20px"}}>Coupons</h1>
        <Modal
                title={` `}
                centered
                visible={showAddModal}
                onOk={() => {
                    adding()

                }}
                onCancel={() => {
                    setAddingSingleCoupon({
                        "name": "",
                        "discount": "",


                    })
                    setShowAddModal(false);
                    document.getElementById('select').selectedIndex = 0


                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>



                    <div>
                        <label>Add Name:</label>
                        <input type="text" value={AddingSingleCoupon.name} onChange={e => setAddingSingleCoupon(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Add discount:</label>
                        <input type="number" value={AddingSingleCoupon.discount} onChange={e =>{
                            if(e.target.value<0){
                                window.alert("Please enter value > 0")
                                setAddingSingleCoupon(prev => ({ ...prev, discount: "" }))
                            }else{
                                setAddingSingleCoupon(prev => ({ ...prev, discount: e.target.value }))
                            }
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>


                </div>


            </Modal>





            <Modal
                title={` `}
                centered
                visible={showAddModal2}
                onOk={() => {
                    update()

                }}
                onCancel={() => {
                    setAddingSingleCoupon({
                        "name": "",
                        "discount": "",


                    })
                    setShowAddModal2(false);
                    document.getElementById('select').selectedIndex = 0


                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>



                    <div>
                        <label>Add Name:</label>
                        <input type="text" value={AddingSingleCoupon.name} onChange={e => setAddingSingleCoupon(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Add discount:</label>
                        <input type="number" value={AddingSingleCoupon.discount} onChange={e =>{
                            if(e.target.value<0){
                                window.alert("Please enter value > 0")
                                setAddingSingleCoupon(prev => ({ ...prev, discount: "" }))
                            }else{
                                setAddingSingleCoupon(prev => ({ ...prev, discount: e.target.value }))
                            }
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>


                </div>


            </Modal>
            <div style={{ background: "purple", color: "white", padding: "8px 10px", cursor: "pointer",position:"absolute",right:"10px",top:"14px",borderRadius: "10%" }} onClick={e => setShowAddModal(true)}>Add Coupon</div>
            { (events.coupon &&events.coupon.length > 0) ?
                <div style={{width:"900px"}}>
                <table class=" table table-bordered table-striped table-hover table-sm table- table-light">
                                            <thead class="thead-dark">
                                                <tr>
                                                   

                                                    <th scope="col">Name </th>
                                                    <th scope="col">Discount</th>
                                                    <th scope="col">Start</th>
                                                    <th scope="col">End</th>
                                                  
                                                    <th scope="col">Actions </th>
                                                </tr>
                                            </thead>

                                            {events.coupon.map(item => (
                                                <tbody>
                                                <tr>
                                                   
                                                    <td scope="col">{item.name} </td>
                                                    <td scope="col">{item.discount}</td>
                                                    <td scope="col">{item.s_date}</td>
                                                    <td scope="col">{item.e_date}</td>
                                                   
                                                    <td><span style={{ padding: "8px", cursor: "pointer" }}
                                        onClick={e => deleteCoupon(item.id)}><i class="fa-solid fa-trash" ></i></span>
                                        <span style={{ padding: "8px", cursor: "pointer" }}
                                         onClick={e => EditCoupon(item.id)}><i class="fa-solid fa-pen" ></i></span>
                                 </td>

                                                </tr>
                                            </tbody>

                            ))}

                                            
                                       
                        </table>
                </div>
             :
                <h4>No coupons yet for this "{events.name}" event. Please Add Coupons</h4>
            }
        </div>
    )
}

export default Coupon