import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Modal, Select } from "antd";
import axios from 'axios'
import Backend_url from '../../Config'
import './products.scss'
import CardIndi from './CardIndi';
import CategoryEdit from './CategoryEdit';
import CategoryIndi from './CategoryIndi';
const Products = ({ who_am_i, eventTrigger, setEventTrigger, eventDetails }) => {
    const navigate = useNavigate()
    const [all_products, setAllProducts] = useState([])
    const [all_search_products, setAllSearchProducts] = useState([])
    const [productTrigger, setPTrigger] = useState(false)

    const [singleid, setSingleId] = useState('')

    const [singleItem, setSingleItem] = useState({})


    const [categories, setCategories] = useState([])
    const [categoryTrigger, setCategoriesTrigger] = useState(false)


    const [AllCat, setCat] = useState([])


    useEffect(() => {
        axios.get(`${Backend_url}/category`).then(res => {

            setCat(res.data)
            setAllSearchProducts(res.data)
            setCategories(res.data)
        })
    }, [productTrigger])




    const [AddsingleItem, setAddSingleItem] = useState({
        "name": "",
        "details": "",

        "images": "",
        "cost": "",


    })

    const [AddEvent, setAddEvent] = useState({
        "name": "",
        "discount": 0,
        "start": "",
        "end": "",
        "coupon": []

    })



    useEffect(() => {
        axios.get(`${Backend_url}/products`).then(res => {
            setAllProducts(res.data)

        })
            .catch(err => {
                window.alert('error happen')
            })
    }, [productTrigger])

    const deletHandle = (id) => {
        if (window.confirm('Do you want to delete product?')) {
            axios.delete(`${Backend_url}/products/${id}`).then(res => {
                setPTrigger(!productTrigger)
            })
        }
    }

    const EditHandle = (id) => {
        setSingleId(id)
        axios.get(`${Backend_url}/products/${id}`).then(res => {
            setSingleItem(res.data)
        })
        setShowModal(true)
    }


    const search = (e,value) => {
       
        if(value==='all'){
            setAllSearchProducts([...AllCat])
        }
        else{
            setAllSearchProducts(AllCat.filter(a => {
                return a.name.toLowerCase()===value.toLowerCase()
            }))
        }
        const allD= document.querySelectorAll('.navCat')
        for(let i=0;i<allD.length;i++){
            allD[i].style.color="black"
        }
       
        e.target.style.color="blue"
    }
    const [showModal, setShowModal] = useState(false);
    const [showEventModal, setEventModal] = useState(false);


    const Update = () => {
        axios.put(`${Backend_url}/products/update`, singleItem).then(res => {
            setPTrigger(!productTrigger)
            setShowModal(false)
        })
    }

    const adding = () => {
        axios.post(`${Backend_url}/products/${AddsingleItem.categories}`, AddsingleItem).then(res => {
            setPTrigger(!productTrigger)
            setAddSingleItem({
                "name": "",
                "details": "",

                "images": "",
                "cost": "",

            })
            setShowAddModal(false)
        }).catch(err => {
            window.alert(err)
        })
    }



    const eventAdd = () => {

        axios.post(`${Backend_url}/events`, AddEvent).then(res => {
            setPTrigger(!productTrigger)
            setEventTrigger(!eventTrigger)
            setEventModal(false)
            setAddEvent({
                "name": "",
                "discount": "",
                "start": "",
                "end": "",

            })

        })

    }


    const [showAddModal, setShowAddModal] = useState(false);
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
        if (AddsingleItem.images !== "" && AddsingleItem.name !== "" && AddsingleItem.categories !== "" && AddsingleItem.details !== "" && AddsingleItem.oldcost !== "") {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [AddsingleItem.categories, AddsingleItem.details, AddsingleItem.images, AddsingleItem.name, AddsingleItem.oldcost])


    const [AddCategory, setAddCategory] = useState({
        "name": "",
    })
    const categoryAdd = () => {
        axios.post(`${Backend_url}/category`, AddCategory).then(res => {
            setAddCategory({
                "name": ""
            })

            setPTrigger(!productTrigger)
            window.alert("Category added 🎉")
            // window.location.reload()
            setShowAddCategoryModal(false)

        }).catch(err => {
            window.alert(err)
            setAddCategory({
                "name": ""
            })
            setShowAddCategoryModal(false)
        })
    }



    const selectFilterChange = (e) => {

        if (e.target.value === 'all') {
            setAllSearchProducts([...all_products])
        }
        else {
            all_products.filter(f => console.log(f.category.toLowerCase() === e.target.value.toLowerCase()))
            setAllSearchProducts(all_products.filter(f => f.category.toLowerCase() === e.target.value.toLowerCase()))
        }

    }




    const [categoryValue, setCategoryValue] = useState('')

    const [showEditCategory, setShowEditCategory] = useState(false)
    return (
        <>
            {/* Editing */}
            {/* Editing */}
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


                okText="Edit"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div><img src={singleItem.image} height={50} width={50} alt='' /></div>
                    <div>
                        <label>Change image url:</label>
                        <input type="text" value={singleItem.image}
                            onChange={e => setSingleItem(prev => ({ ...prev, image: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Change Name:</label>
                        <input type="text" value={singleItem.name} onChange={e => setSingleItem(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Change Cost:</label>
                        <input type="text" value={singleItem.newcost} onChange={e => {
                            if (e.target.value < 0) {
                                window.alert("please enter value >= 0")
                                setSingleItem(prev => ({ ...prev, newcost: "" }))
                            }
                            else {
                                setSingleItem(prev => ({ ...prev, newcost: e.target.value }))
                            }
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label>Change details:</label>
                        <textarea type="text" value={singleItem.details} onChange={e => setSingleItem(prev => ({ ...prev, details: e.target.value }))} style={{ width: "100%", padding: "5px" }}></textarea>
                    </div>
                </div>


            </Modal>

            {/* Adding */}
            <Modal
                title={<span id="error" style={{ color: "red" }}></span>}
                centered
                visible={showAddModal}
                onOk={() => {
                    adding()

                }}
                onCancel={() => {
                    setAddSingleItem({
                        "name": "",
                        "details": "",
                        "category": "",
                        "images": "",
                        "cost": "",

                    })
                    setShowAddModal(false);


                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", gap: "10px" }}>
                    <div><img src={AddsingleItem.images} height={280} width={150} alt='' /></div>
                    <div>
                        <div>
                            <label> image url:</label>
                            <input type="text" onChange={e => {
                                if (e.target.value.length <= 255 && /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(e.target.value)) {
                                    document.getElementById('error').textContent = ""
                                    setAddSingleItem(prev => ({ ...prev, images: e.target.value }))
                                }
                                else {
                                    document.getElementById('error').textContent = "Not a valid url"
                                    setAddSingleItem(prev => ({ ...prev, images: "" }))
                                }
                            }} style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div>
                            <label> Name:</label>
                            <input type="text" value={AddsingleItem.name} onChange={e => {
                                if (!isNaN(e.target.value)) {
                                    window.alert("enter only string")
                                    setAddSingleItem(prev => ({ ...prev, name: "" }))
                                }
                                else {
                                    setAddSingleItem(prev => ({ ...prev, name: e.target.value }))
                                }
                            }} style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div>
                            <label> Cost:</label>
                            <input type="number" value={AddsingleItem.cost} onChange={e => {
                                if (e.target.value < 0) {
                                    window.alert("please enter value >= 0")
                                    setAddSingleItem(prev => ({ ...prev, oldcost: "", cost: "" }))
                                }
                                else {
                                    setAddSingleItem(prev => ({ ...prev, oldcost: e.target.value, cost: e.target.value }))
                                }
                            }
                            } style={{ width: "100%", padding: "5px" }} />
                        </div>
                        <div>
                            <label> Category:</label>
                            <select onChange={e => {
                                setAddSingleItem(prev => ({ ...prev, category: e.target.value }))
                            }}
                                style={{ width: "103%", padding: "10px", }}
                            >
                                <option disabled selected hidden>Select Category</option>

                                {categories.map(c => (
                                    <option value={c.name}>{c.name}</option>
                                ))}
                            </select>


                        </div>
                        <div>
                            <label> details:</label>
                            <textarea type="text" value={AddsingleItem.details} onChange={e => setAddSingleItem(prev => ({ ...prev, details: e.target.value }))} style={{ width: "100%", padding: "5px" }}></textarea>
                        </div>
                    </div>
                </div>


            </Modal>



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
                        "discount": "",
                        "start": "",
                        "end": "",

                    })
                    setEventModal(false);


                }}

                okButtonProps={{ disabled: btnPropsEvent, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    <div>
                        <label> Event Name:</label>
                        <input type="text" value={AddEvent.name} onChange={e => setAddEvent(prev => ({ ...prev, name: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    { <div>
                        <label>Add Event discount in %:</label>
                        <input type="number" value={AddEvent.discount} onChange={e => setAddEvent(prev => ({ ...prev, discount: e.target.value }))} style={{ width: "100%", padding: "5px" }} placeholder="Example 6" />
                    </div> }
                    <div>
                        <label> Start date:</label>
                        <input type="date" value={AddEvent.start} onChange={e => {
                            setAddEvent(prev => ({ ...prev, start: e.target.value }))






                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>
                    <div>
                        <label> End date:</label>
                        <input type="date" value={AddEvent.end} onChange={e => {
                            if (new Date(AddEvent.start) < new Date(e.target.value)) {
                                setAddEvent(prev => ({ ...prev, end: e.target.value }))
                            }
                            else {
                                setAddEvent(prev => ({ ...prev, end: AddEvent.start }))
                                window.alert("Event should be after start date")
                            }

                        }
                        } style={{ width: "100%", padding: "5px" }} />
                    </div>

                </div>


            </Modal>


            {/* Adding Category */}
            <Modal
                title={` `}
                centered
                visible={showAddCategoryModal}
                onOk={() => {
                    categoryAdd()

                }}
                onCancel={() => {
                    setAddCategory({
                        "name": "",


                    })
                    setShowAddCategoryModal(false);


                }}

                okButtonProps={{ disabled: AddCategory.name !== '' ? false : true, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    <div>
                        <label> Category Name:</label>
                        <input type="text" value={AddCategory.name} onChange={e => {
                            if (isNaN(e.target.value)) {
                                setAddCategory(prev => ({ ...prev, name: e.target.value }))
                            }
                            else {
                                window.alert("Please enter a string")
                                setAddCategory(prev => ({ ...prev, name: "" }))
                            }
                        }} style={{ width: "100%", padding: "5px" }} />
                    </div>


                </div>


            </Modal>


            {/* Editing Categery */}



            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ maxWidth: "900px",display:"flex",justifyContent:"space-between",padding:"10px 35px" ,overflowX:"scroll"}}>
                    {/* <input type="text" onChange={search} style={{ padding: "15px", border: "2px solid #6439ff", width: "90%", margin: "5px 20px", outline: "0", borderRadius: "10px" }} placeholder="search with category" /> */}
                    <div onClick={e=>{search(e,'all')}} style={{cursor:"pointer",fontSize:"18psx",fontWeight:"600",background: "darkorange",padding:"8px",borderRadius: "15%",color:"white"}} id='all' className="navCat">View All</div>
                        {categories.map(c=>(
                            <div onClick={e=>{search(e,c.name)}} style={{cursor:"pointer",fontSize:"18psx",fontWeight:"600",background: "darkorange",padding:"8px",borderRadius: "15%",color:"white"}} id={c.name} className="navCat">{c.name}</div>
                        ))}
                    
                </div>
                {all_search_products.map(all => (
                    <CategoryIndi AllCat={all} productTrigger={productTrigger} setProductTrigger={setPTrigger} setCategoriesTrigger={setCategoriesTrigger} setShowEditCategory={setShowEditCategory} categoryTrigger={categoryTrigger} who_am_i={who_am_i} categories={categories} />
                ))}



                {who_am_i === 'admin' && <div ><div style={{ background: "darkorange", color: "white", padding: "8px", cursor: "pointer", marginLeft: "20px", position: "absolute", right: "10px", top: "25px",fontWeight:"bold",borderRadius: "15%" }} onClick={e => setShowAddCategoryModal(true)}><i class="fa-solid fa-plus"></i> Category</div></div>}

            </div>

        </>
    )

}

export default Products