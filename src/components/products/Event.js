import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Modal, Select } from "antd";
import axios from 'axios'
import Backend_url from '../../Config'
import './products.scss'
import CardIndi from './CardIndi';
import EventIndi from './EventIndi';
import { Link } from 'react-router-dom';
const Event = ({ who_am_i, eventTrigger, setEventTrigger, eventDetails }) => {
    const navigate = useNavigate()
    const [all_products, setAllProducts] = useState([])
    const [all_search_products, setAllSearchProducts] = useState([])
    const [productTrigger, setPTrigger] = useState(false)

    const [singleid, setSingleId] = useState('')

    const [singleItem, setSingleItem] = useState({})


    const [categories, setCategories] = useState([])
    const [categoryTrigger, setCategoriesTrigger] = useState(false)
    useEffect(() => {
        axios.get(`${Backend_url}/category`).then(res => {
            setCategories(res.data)
        })
    }, [categoryTrigger])

    const [AddsingleItem, setAddSingleItem] = useState({
        "name": "",
        "details": "",
        "category": "",
        "images": "",
        "cost": "",


    })

    const [AddEvent, setAddEvent] = useState({
        "name": "",
        "discount": 0,
        "s_date": "",
        "e_date": "",
        "coupon": []

    })



    useEffect(() => {
        axios.get(`${Backend_url}/events`).then(res => {
            setAllProducts(res.data)
            setAllSearchProducts(res.data)
        })
            .catch(err => {
                window.alert('error happen')
            })
    }, [productTrigger])






    const [showModal, setShowModal] = useState(false);
    const [showEventModal, setEventModal] = useState(false);







    const eventAdd = () => {

        axios.post(`${Backend_url}/events`, AddEvent).then(res => {
            setPTrigger(!productTrigger)
            setEventTrigger(!eventTrigger)
            setEventModal(false)
            setAddEvent({
                "name": "",
                "coupon": [],
                "s_date": "",
                "e_date": "",

            })
            window.alert("Event added successfully")
            setEventModal(false)
        })

    }




    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    const [btnProps, setBtnProps] = useState(true)
    const [btnPropsEvent, setBtnPropsEvent] = useState(true)

    useEffect(() => {
        if (AddEvent.name !== "" && AddEvent.discount !== "" && AddEvent.start !== "" && AddEvent.end !== "") {
            setBtnPropsEvent(false)

        }
        else {
            setBtnPropsEvent(true)
        }
    }, [AddEvent.discount, AddEvent.end, AddEvent.name, AddEvent.start])



    useEffect(() => {
        if (AddsingleItem.images !== "" && AddsingleItem.name !== "" && AddsingleItem.category !== "" && AddsingleItem.details !== "" && AddsingleItem.oldcost !== "") {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [AddsingleItem.category, AddsingleItem.details, AddsingleItem.images, AddsingleItem.name, AddsingleItem.oldcost])



    const removeItem = (id) => {
        if (window.confirm('Do you want to delete the event')) {
            axios.delete(`${Backend_url}/events/${id}`).then(res => {
                window.alert("Event deleted successfully")
                setPTrigger(!productTrigger)

            })
        }
    }




    const [showAddModal, setShowAddModal] = useState(false);

    const [item, setItem] = useState({})
    const checkoutHandle = (item) => {
        axios.put(`${Backend_url}/events`, {
            "id": item.id,
            "coupon": [...item.coupon],
            ...AddEvent
        }).then(res => {
            window.alert("Event edited successfully")
            setPTrigger(!productTrigger)

            setShowAddModal(false);

        })
    }

    return (
        <>


            <h1 style={{ marginLeft: "20px" }}>Events</h1>
            {/* Adding Event */}

            <Modal
                title={` `}
                centered
                visible={showEventModal}
                onOk={() => {
                    eventAdd()

                }}
                onCancel={() => {
                    setAddEvent({
                        "name": "",

                        "s_date": "",
                        "e_date": "",

                    })
                    setEventModal(false);


                }}

                okButtonProps={{ disabled: btnPropsEvent, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    <div>
                        <label>Add Event Name:</label>
                        <input type="text" value={AddEvent.name} onChange={e => {
                            if (isNaN(e.target.value)) {
                                setAddEvent(prev => ({ ...prev, name: e.target.value }))
                            }
                            else {
                                window.alert("please enter a string")
                                setAddEvent(prev => ({ ...prev, name: "" }))
                            }
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>

                    <div>
                        <label>Add Start date:</label>
                        <input type="date" value={AddEvent.s_date} onChange={e => {
                            let d_now = new Date();
                            let d_inp = new Date(e.target.value)
                            if (d_now.getFullYear() < d_inp.getFullYear()) {
                                setAddEvent(prev => ({ ...prev, s_date: e.target.value }))

                            }
                            else if (d_now.getFullYear() === d_inp.getFullYear()) {
                                if (d_now.getMonth() < d_inp.getMonth()) {
                                    setAddEvent(prev => ({ ...prev, s_date: e.target.value }))
                                }
                                else if (d_now.getMonth() === d_inp.getMonth()) {

                                    if (d_now.getTime() <= d_inp.getTime() || d_now.getDate() === d_inp.getDate()) {
                                        setAddEvent(prev => ({ ...prev, s_date: e.target.value }))
                                    }
                                    else {
                                        window.alert('select future or current Day')
                                    }

                                }
                                else {
                                    window.alert('select future or current Month')
                                }
                            }
                            else {
                                window.alert('select future or current year')
                            }












                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Add End date:</label>
                        <input type="date" value={AddEvent.e_date} onChange={e => {
                            if (new Date(AddEvent.s_date) < new Date(e.target.value)) {
                                setAddEvent(prev => ({ ...prev, e_date: e.target.value }))
                            }
                            else {
                                setAddEvent(prev => ({ ...prev, e_date: AddEvent.s_date }))
                                window.alert("Event should be after start date")
                            }

                        }
                        } style={{ width: "100%", padding: "5px" }} />
                    </div>

                </div>


            </Modal>

            <Modal
                title={`Edit Event `}
                centered
                visible={showAddModal}
                onOk={() => {
                    checkoutHandle(item)

                }}
                onCancel={() => {
                    setAddEvent({
                        "name": "",

                        "s_date": "",
                        "e_date": "",

                    })
                    setShowAddModal(false);


                }}



                okText="Edit"
                cancelText="Close"
            >
                 <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

<div>
    <label>Add Event Name:</label>
    <input type="text" value={AddEvent.name} onChange={e => {
        if (isNaN(e.target.value)) {
            setAddEvent(prev => ({ ...prev, name: e.target.value }))
        }
        else {
            window.alert("please enter a string")
            setAddEvent(prev => ({ ...prev, name: "" }))
        }
    }} style={{ width: "100%", padding: "5px" }} />
</div>

<div>
    <label>Add Start date:</label>
    <input type="date" value={AddEvent.s_date} onChange={e => {
        let d_now = new Date();
        let d_inp = new Date(e.target.value)
        if (d_now.getFullYear() < d_inp.getFullYear()) {
            setAddEvent(prev => ({ ...prev, s_date: e.target.value }))

        }
        else if (d_now.getFullYear() === d_inp.getFullYear()) {
            if (d_now.getMonth() < d_inp.getMonth()) {
                setAddEvent(prev => ({ ...prev, s_date: e.target.value }))
            }
            else if (d_now.getMonth() === d_inp.getMonth()) {

                if (d_now.getTime() <= d_inp.getTime() || d_now.getDate() === d_inp.getDate()) {
                    setAddEvent(prev => ({ ...prev, s_date: e.target.value }))
                }
                else {
                    window.alert('select future or current Day')
                }

            }
            else {
                window.alert('select future or current Month')
            }
        }
        else {
            window.alert('select future or current year')
        }












    }} style={{ width: "100%", padding: "5px" }} />
</div>
<div>
    <label>Add End date:</label>
    <input type="date" value={AddEvent.e_date} onChange={e => {
        if (new Date(AddEvent.s_date) < new Date(e.target.value)) {
            setAddEvent(prev => ({ ...prev, e_date: e.target.value }))
        }
        else {
            setAddEvent(prev => ({ ...prev, e_date: AddEvent.s_date }))
            window.alert("Event should be after start date")
        }

    }
    } style={{ width: "100%", padding: "5px" }} />
</div>

</div>


            </Modal>





            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>





                {who_am_i === 'admin' && <div style={{ background: "#6439ff ", color: "white", padding: "8px 10px", cursor: "pointer", position: "absolute", right: "10px", top: "14px",borderRadius: "15%" }} onClick={e => setEventModal(true)}>Add event</div>}

            </div>
            <div className='cardAll'>

                {all_search_products.length > 0 ?
                    <>
                        <div style={{ width: "900px" }}>
                            <table class=" table table-bordered table-striped table-hover table-sm table- table-light">
                                <thead class="thead-dark">
                                    <tr>


                                        <th scope="col">Name </th>
                                        <th scope="col">start date</th>
                                        <th scope="col">end date</th>
                                        <th scope="col">Coupons</th>
                                        <th scope="col">View</th>
                                        <th scope="col">Actions </th>
                                    </tr>
                                </thead>

                                {all_search_products.map(item => (
                                    <tbody>
                                        <tr>

                                            <td scope="col">{item.name} </td>
                                            <td scope="col">{item.s_date} </td>
                                            <td scope="col">{item.e_date} </td>
                                            <td scope="col">{item.coupon.length}</td>
                                            <td scope="col"><Link to={`/coupons/${item.id}`} style={{ marginLeft: "20px", border: "none", outline: "0", cursor: "pointer" }}>View Coupons</Link> </td>
                                            <td><span style={{ padding: "8px", cursor: "pointer" }}
                                                onClick={e => removeItem(item.id)}><i class="fa-solid fa-trash" ></i></span>
                                                <span style={{ padding: "8px", cursor: "pointer" }}
                                                    onClick={e => {
                                                        setShowAddModal(true)
                                                        setItem(item)
                                                        setAddEvent(item)
                                                    }}
                                                ><i class="fa-solid fa-pen" ></i></span></td>


                                        </tr>
                                    </tbody>

                                ))}



                            </table>
                        </div>

                        {all_search_products.map(item => (

                            <div>

                                {/* <EventIndi item={item} who_am_i={who_am_i} productTrigger={productTrigger} setPTrigger={setPTrigger} /> */}

                            </div>

                        ))}
                    </>
                    :

                    <h4>No Events yet.</h4>

                }


            </div>
        </>
    )

}

export default Event