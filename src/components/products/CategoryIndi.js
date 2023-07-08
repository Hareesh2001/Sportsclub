import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CardIndi from './CardIndi'
import axios from 'axios'
import Backend_url from '../../Config'
const CategoryIndi = ({ AllCat, who_am_i, productTrigger, setProductTrigger, categories }) => {
    const [catName, setCatName] = useState('')

    const [oldName, setOldName] = useState('')
    const [showAddModal, setShowAddModal] = useState(false);
    const [AddsingleItem, setAddSingleItem] = useState({
        "name": "",
        "details": "",

        "images": "",
        "cost": "",


    })

    const adding = () => {
        axios.post(`${Backend_url}/products/${AllCat.id}`, AddsingleItem).then(res => {
            setProductTrigger(!productTrigger)
            setAddSingleItem({
                "name": "",
                "details": "",

                "images": "",
                "cost": "",

            })
            window.alert("product added successfully")
            setShowAddModal(false)
        }).catch(err => {
            window.alert(err)
        })
    }

    useEffect(() => {
        setCatName(AllCat.name)
        setOldName(AllCat.name)
    }, [AllCat.name])

    const navigate = useNavigate()


    const [btnProps, setBtnProps] = useState(true)
    useEffect(() => {
        if (/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(AddsingleItem.images) && AddsingleItem.name !== "" && AddsingleItem.categories !== "" && AddsingleItem.details !== "" && AddsingleItem.oldcost !== "") {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [AddsingleItem.categories, AddsingleItem.details, AddsingleItem.images, AddsingleItem.name, AddsingleItem.oldcost])



    const EditHandle = (e, id) => {
        if (window.confirm('Do you want to edit the category name?')) {
            axios.put(`${Backend_url}/category/${oldName}`, {
                "id": id,
                "name": catName,
                "products": [...AllCat.products]
            }).then(res => {
                setProductTrigger(!productTrigger)
                e.target.parentElement.parentElement.previousSibling.textContent = "Category updated"
                setTimeout(() => {
                    e.target.parentElement.parentElement.previousSibling.textContent = ""
                    // window.location.reload()
                }, 3000)


            }).catch(err => {
                window.alert(err)
            })
        }
    }

    const deleteHandle = (id) => {
        if (window.confirm("Do you want to delete the Category")) {
            axios.delete(`${Backend_url}/category/${id}`).then(res => {
                setProductTrigger(!productTrigger)

                // window.location.reload()

            }).catch(err => {
                window.alert(err)
            })
        }
    }
    return (
        <div style={{ padding: "10px 20px", position: "relative" }}>
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

                        "images": "",
                        "cost": "",

                    })
                    setShowAddModal(false);


                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}

                okText="Add"
                cancelText="Close"
            >
                <div style={{}}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div >
                            <div><img src={AddsingleItem.images} height={200} width={150} alt='' /></div>
                        </div>
                        <div>
                            <div>
                                <label style={{ color: "#6439ff " }}>Image</label>
                                <input type="text" value={AddsingleItem.images} onChange={e => {
                                    if (e.target.value.length <= 255 && /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(e.target.value)) {
                                        document.getElementById('error').textContent = ""
                                        setAddSingleItem(prev => ({ ...prev, images: e.target.value }))
                                    }
                                    else {
                                        document.getElementById('error').textContent = "Not a valid url"
                                        setAddSingleItem(prev => ({ ...prev, images: e.target.value }))
                                       
                                    }
                                }} style={{ width: "135%", padding: "5px" }} />
                            </div>
                            <div>
                            <label  style={{ color: "#6439ff " }}> Name:</label>
                            <input type="text" value={AddsingleItem.name} onChange={e => {
                                if (!isNaN(e.target.value)) {
                                    window.alert("enter only string")
                                    setAddSingleItem(prev => ({ ...prev, name: "" }))
                                }
                                else {
                                    setAddSingleItem(prev => ({ ...prev, name: e.target.value }))
                                }
                            }} style={{ width: "135%", padding: "5px" }} />
                            </div>
                            <div>
                            <label  style={{ color: "#6439ff " }}> Cost:</label>
                            <input type="number" value={AddsingleItem.cost} onChange={e => {
                                if (e.target.value < 0) {
                                    window.alert("please enter value >= 0")
                                    setAddSingleItem(prev => ({ ...prev, oldcost: "", cost: "" }))
                                }
                                else {
                                    setAddSingleItem(prev => ({ ...prev, oldcost: e.target.value, cost: e.target.value }))
                                }
                            }
                            } style={{ width: "135%", padding: "5px" }} />
                        </div>
                        </div>
                    </div>
                    <div>


                       
                        <div>
                            <label  style={{ color: "#6439ff ",cursor:"not-allowed" }}> Category:</label>
                            <input type="text" disabled value={AllCat.name} style={{ width: "100%", padding: "5px" }} />


                        </div>
                        <div>
                            <label  style={{ color: "#6439ff " }}> Description:</label>
                            <input type="text" value={AddsingleItem.details} onChange={e => setAddSingleItem(prev => ({ ...prev, details: e.target.value }))} style={{ width: "100%", padding: "5px" }} />
                        </div>
                    </div>
                </div>


            </Modal>

            <div>

                {who_am_i === 'admin' && <input type="text" value={catName} onChange={e => setCatName(e.target.value)}
                    style={{ padding: "10px", border: "none", outline: "0", fontSize: "40px" }}
                    className="catIn"
                />}
                <span style={{ marginLeft: "-70px", color: "green", fontSize: "18px" }}></span>
                <div> {who_am_i === "admin" && <>  <span style={{ background: "", color: "blue", cursor: "pointer", marginLeft: "5px" }} onClick={e => EditHandle(e, AllCat.id)}><i class="fa-solid fa-pen"></i></span>
                    <span style={{ background: "", color: "red", cursor: "pointer", marginLeft: "15px" }} onClick={e => { deleteHandle(AllCat.id) }}><i class="fa-solid fa-trash"></i></span></>}</div>

                {who_am_i === 'user' && <input type="text" value={catName} onChange={e => setCatName(e.target.value)}
                    style={{ padding: "10px", border: "none", outline: "0", fontSize: "40px" }}
                    disabled
                />}
            </div>
            {who_am_i === 'admin' && <div style={{ background: "radial-gradient(circle at 12.3% 19.3%, rgb(95, 209, 249) 0%,  rgb(85, 88, 218) 100.2%)", color: "white", padding: "8px 10px", cursor: "pointer", position: "absolute", right: "10px", top: "38px" }} onClick={e => setShowAddModal(true)}>Add {AllCat.name} Product</div>}

            <div className='cardAll'>

                {AllCat.products.length > 0 ?
                    <>
                        {AllCat.products.map(item => (
                            who_am_i === 'user' ? <div><CardIndi item={item} />

                            </div> :
                                <div>

                                    <CardIndi item={item} who_am_i={who_am_i} productTrigger={productTrigger} setProductTrigger={setProductTrigger} />

                                </div>

                        ))}
                    </>
                    :
                    <div >
                        <p>No data is Found</p>
                    </div>
                }


            </div>
        </div>
    )
}

export default CategoryIndi