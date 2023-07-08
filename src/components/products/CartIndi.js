import { SettingOutlined, EditOutlined } from '@ant-design/icons'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons/lib/icons'

import { Avatar, Card, Modal } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Backend_url from '../../Config'

const CartIndi = ({ item, who_am_i, setPTrigger, productTrigger }) => {
    const navigate = useNavigate()
    const deletHandle = () => {
        if (window.confirm('Do you want to delete product?')) {
            axios.delete(`${Backend_url}/products/${item.id}`).then(res => {
                setPTrigger(!productTrigger)
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
            setPTrigger(!productTrigger)
            setShowModal(false)
        })
    }
    return (
        <div className=''>
            <Modal
                title={` `}
                centered
                visible={showModal}
                onOk={() => {
                    Update()

                }}
                onCancel={() => {
                    setShowModal(false);

                }}


                okText="Edit"
                cancelText="Close"
            >
                <div style={{ display: "flex", gap: "10px" }}>
                    <div><img src={singleItem.images} height={280} width={150} alt='' /></div>
                    <div>
                        <div style={{ marginBottom: "20px" }}>
                            <label>Change image url:</label>
                            <input type="text" value={singleItem.images} onChange={e => setSingleItem(prev => ({ ...prev, images: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label>Change Name:</label>
                            <input type="text" value={singleItem.name} onChange={e => setSingleItem(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label>Change Cost:</label>
                            <input type="text" value={singleItem.cost} onChange={e => setSingleItem(prev => ({ ...prev, cost: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label>Change Details:</label>
                            <input type="text" value={singleItem.details} onChange={e => setSingleItem(prev => ({ ...prev, details: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                    </div>
                </div>


            </Modal>

            { <Card
                style={{ width: 300 }}
                cover={
                    <img
                        alt="example"
                        src={item.images}
                        height={300}
                    />
                }
                actions={[

                    who_am_i === 'admin' && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px" }}><EditOutlined key="edit" onClick={e => EditHandle()} /><DeleteOutlined key="ellipsis" onClick={deletHandle} /></div>

                ]}
            >
                <Meta

                    title=<span> &#8377;{item.cost} -- {item.name}({item.count} items)</span>


                    description={item.details && item.details.slice(0, 32)}
                />
            </Card> }

           





        </div>
    )
}

export default CartIndi