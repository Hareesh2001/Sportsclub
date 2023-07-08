import { SettingOutlined, EditOutlined } from '@ant-design/icons'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons/lib/icons'

import { Avatar, Card, Modal } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Backend_url from '../../Config'

const CardIndi = ({ item, who_am_i, setProductTrigger, productTrigger }) => {
    const navigate = useNavigate()
    
    
    const deletHandle = () => {
        if (window.confirm('Do you want to delete product?')) {
            axios.delete(`${Backend_url}/products/${item.id}`).then(res => {
              
                setProductTrigger(!productTrigger)
            })
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [singleItem, setSingleItem] = useState({})
    const EditHandle = () => {

        axios.get(`${Backend_url}/products/${item.id}`).then(res => {
            setSingleItem(res.data)
        })
        setShowModal(true)
    }

    // REMOVE ID 
    const Update = () => {
        axios.put(`${Backend_url}/products`, { ...singleItem, "id": item.id }).then(res => {
            window.alert("product edited")

            setProductTrigger(!productTrigger)
            setShowModal(false)
        })
    }

    const [btnProps, setBtnProps] = useState(true)
    useEffect(() => {
        if ( /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(singleItem.images) && singleItem.name !== "" && singleItem.categories !== "" && singleItem.details !== "" && singleItem.oldcost !== "") {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [singleItem.categories, singleItem.details, singleItem.images, singleItem.name, singleItem.oldcost])

    return (
        <div className=''>
            <Modal
                title={<span id="error" style={{ color: "red" }}></span>}
                centered
                visible={showModal}
                onOk={() => {
                    Update()

                }}
                onCancel={() => {
                    setShowModal(false);

                }}
                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}

                okText="Edit"
                cancelText="Close"
            >
               <div style={{}}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div >
                            <div><img src={singleItem.images} height={200} width={150} alt='' /></div>
                        </div>
                        <div>
                            <div>
                                <label style={{ color: "#6439ff " }}>Image</label>
                                <input type="text" value={singleItem.images}  onChange={e => {
                                    if (e.target.value.length <= 255 && /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(e.target.value)) {
                                        document.getElementById('error').textContent = ""
                                        setSingleItem(prev => ({ ...prev, images: e.target.value }))
                                        
                                    }
                                    else {
                                        document.getElementById('error').textContent = "Not a valid url"
                                        setSingleItem(prev => ({ ...prev, images: e.target.value }))
                                    }
                                }} style={{ width: "135%", padding: "5px" }} placeholder="Please paste url"/>
                            </div>
                            <div>
                            <label  style={{ color: "#6439ff " }}> Name:</label>
                            <input type="text" value={singleItem.name} onChange={e => {
                                if (!isNaN(e.target.value)) {
                                    window.alert("enter only string")
                                    setSingleItem(prev => ({ ...prev, name: "" }))
                                }
                                else {
                                    setSingleItem(prev => ({ ...prev, name: e.target.value }))
                                }
                            }} style={{ width: "135%", padding: "5px" }} />
                            </div>
                            <div>
                            <label  style={{ color: "#6439ff " }}> Cost:</label>
                            <input type="number" value={singleItem.cost} onChange={e => {
                                if (e.target.value < 0) {
                                    window.alert("please enter value >= 0")
                                    setSingleItem(prev => ({ ...prev, oldcost: "", cost: "" }))
                                }
                                else {
                                    setSingleItem(prev => ({ ...prev, oldcost: e.target.value, cost: e.target.value }))
                                }
                            }
                            } style={{ width: "135%", padding: "5px" }} />
                        </div>
                        </div>
                    </div>
                    <div>


                       
                       
                        <div>
                            <label  style={{ color: "#6439ff " }}> Description:</label>
                            <input type="text" value={singleItem.details} onChange={e => setSingleItem(prev => ({ ...prev, details: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                    </div>
                </div>


            </Modal>

            <Card
                style={{ width: 300, borderRadius: "5%", boxShadow: "0 0 20px 0 rgba(0, 0, 0, 1), 0 5px 5px 0 rgba(0, 0, 0, 0.24)" }}
                cover={
                    <img
                        alt="example"
                        src={item.images}
                        height={150}
                        width={100}
                        style={{ objectFit: "contain", borderRadius: "0%" }}

                    />
                }

            >
                <Meta

                    title=<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>  <div> {item.name}</div>  <div>&#8377;{item.cost}</div></div>


                    description=<div style={{ marginLeft: "20px" }}>{item.details && item.details.slice(0, 32)}</div>
                />
                {who_am_i === 'admin' ? <div style={{ padding: "5px", border: "none", display: "flex", justifyContent: "space-between", width: "63%", marginLeft: "40px", marginTop: "20px" }}>
                    <EditOutlined key="edit" onClick={e => EditHandle()} />
                    <DeleteOutlined key="ellipsis" onClick={deletHandle} /></div>
                    :
                   <>
                   
                    <div style={{ padding: "5px", display: "flex", justifyContent: "space-between", width: "63%", marginLeft: "40px", marginTop: "20px" }}>
                        <button style={{ background: "radial-gradient(circle at 12.3% 19.3%, darkorange 0%,  darkorange 100.2%)",  color: "white", padding: "8px 10px", cursor: "pointer",border:"none",outline:"0" ,marginLeft:"35px",fontWeight:"bold",borderRadius: "10%"}}
                         onClick={e => {
                                navigate(`/product/${item.id}`)
                            }}
                        >Buy Now</button>
                        
                        </div>
                   </>

                }

            </Card>



        </div>
    )
}

export default CardIndi