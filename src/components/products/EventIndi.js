import { SettingOutlined, EditOutlined } from '@ant-design/icons'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons/lib/icons'

import { Avatar, Card, Modal } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Backend_url from '../../Config'
import { Link } from 'react-router-dom'

const EventIndi = ({ item, who_am_i, setPTrigger, productTrigger }) => {
    const navigate = useNavigate()


    const deletHandle = () => {
        if (window.confirm('Do you want to delete the event')) {
            axios.delete(`${Backend_url}/events/${item.id}`).then(res => {

                setPTrigger(!productTrigger)

            })
        }
    }


    const [showAddModal, setShowAddModal] = useState(false);

    const [AddEvent, setAddEvent] = useState({
        "name": "",

        "s_date": "",
        "e_date": "",

    })
    useEffect(() => {

        setAddEvent({
            "name": item.name,

            "s_date": item.s_date,
            "e_date": item.e_date,

        })

    }, [item])





    const EditEvent = () => {
        axios.put(`${Backend_url}/events`, {
            "id": item.id,
            "coupon": [...item.coupon],
            ...AddEvent
        }).then(res => {
            setPTrigger(!productTrigger)
            window.alert("Event edited successfully")
            setShowAddModal(false);

        })

    }
    return (
        <div className=''>
              <Modal
                title={`Edit Event `}
                centered
                visible={showAddModal}
                onOk={() => {
                    EditEvent()

                }}
                onCancel={() => {

                    setShowAddModal(false);


                }}



                okText="Edit"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    <div>
                        <label>Add Event Name:</label>
                        <input type="text" value={AddEvent.name} onChange={e => setAddEvent(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>

                    <div>
                        <label>Add s_date date:</label>
                        <input type="date" value={AddEvent.s_date} onChange={e => {
                            setAddEvent(prev => ({ ...prev, s_date: e.target.value }))
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Add e_date date:</label>
                        <input type="date" value={AddEvent.e_date} onChange={e => {
                            setAddEvent(prev => ({ ...prev, e_date: e.target.value }))

                        }
                        } style={{ width: "100%", padding: "5px" }} />
                    </div>

                </div>


            </Modal>


          
           <Card 
                style={{ width: 300,  border: "1px solid gray" }}

                actions={[

                    who_am_i === 'admin' && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px" }}><EditOutlined key="edit" onClick={e => { setShowAddModal(true) }} /><DeleteOutlined key="ellipsis" onClick={deletHandle} /></div>

                ]}
            >
                <Meta

                    title=<p style={{ textAlign: "center" }}>{item.name}</p>


                    description={item.details && item.details.slice(0, 32)}
                />
                <div style={{ marginTop: "10px" }}> <span style={{ fontSize: "13px", fontWeight: "600" ,marginright:"20px"}}>Coupons:</span><span>{item.coupon.length} </span><Link to={`/coupons/${item.id}`} style={{marginLeft:"20px",border:"none",outline:"0",cursor:"pointer"}}>View Coupons</Link></div>
                <div style={{ marginTop: "10px" }}> <span style={{ fontSize: "13px", fontWeight: "600",marginright:"20px" }}>s_date:</span>{item.s_date}</div>
                <div style={{ marginTop: "10px" }}> <span style={{ fontSize: "13px", fontWeight: "600",marginright:"20px" }}>e_date:</span>{item.e_date}</div>
            </Card>
           



        </div>
    )
}

export default EventIndi