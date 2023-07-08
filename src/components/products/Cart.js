import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Backend_url from '../../Config'
import CardIndi from './CardIndi'
import { useNavigate } from 'react-router'
import { Modal } from "antd";
import CartIndi from './CartIndi'
const Cart = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()
    const [discountAmount, setDisCountAmount] = useState(0)

    const [p, setP] = useState(0)
    const [nameonCard, setNameOnCard] = useState("")
    const [address, setaddress] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [mobile, setMobile] = useState("")
    const [expiry, setExpiry] = useState("")
    const [zip, setZip] = useState("")

    const [buyItem, setBuuyItem] = useState({})
    const [security, setSecurity] = useState("")
    const [all_products, setAllProducts] = useState([])
    const [all_search_products, setAllSearchProducts] = useState([])
    const [productTrigger, setPTrigger] = useState(false)
    const [coupons, setCoupons] = useState([])
    useEffect(() => {

        axios.get(`${Backend_url}/cart`).then(res => {

            if (res.data.length === 0) {
                setAllProducts([])
                setAllSearchProducts([])
            }
            else {
                setAllProducts(res.data.filter(d => {

                    return d.email === JSON.parse(localStorage.getItem('user')).email




                }))
            }


        })
            .catch(err => {
                window.alert('error happen')
            })
    }, [productTrigger])

    useEffect(() => {
        axios.get(`${Backend_url}/coupons`).then(res => {
            setCoupons(res.data)


        })
            .catch(err => {
                window.alert('error happen')
            })
    }, [])









    const removeItem = (id) => {
        axios.delete(`${Backend_url}/cart/${id}`).then(res => {
            window.alert("item removed successfully")
            setPTrigger(!productTrigger)
        })
    }
    const checkoutHandle = (item) => {

        setBuuyItem(item)
        setDisCountAmount(item.cost)
        setShowModal(true)

    }
   
    const [couponDiscount, setCouponDiscount] = useState(0)
    const disHandler = (e) => {
        setDisCountAmount(buyItem.cost)
        coupons.map(c => {
            if (e.target.value === c.name) {

                if (new Date(c.s_date) > new Date() || new Date(c.e_date) < new Date()) {
                    window.alert('Coupon is not available for todays date')
                    e.target.value = ""
                }

                else {
                    const a = discountAmount - c.discount

                    setDisCountAmount(a)
                    setCouponDiscount(c.discount)
                }


            }

        })

    }
    const [btnProps, setBtnProps] = useState(true)
    useEffect(() => {
        if (nameonCard !== ""  && security !== "" && address!==''&& security.length === 3 && zip !== ""&&zip.length===6 && cardNumber !== "" && cardNumber.length === 13 && mobile.length === 10 && expiry!=='') {
            setBtnProps(false)

        }
        else {
            setBtnProps(true)
        }
    }, [address, cardNumber, expiry, mobile.length, nameonCard, security, zip])

    const removeFromCart = () => {
        axios.delete(`${Backend_url}/cart/${buyItem.id}`).then(res => {
            setPTrigger(!productTrigger)
            navigate('/orders')
        })
    }



    // CHANGES MADE HERE


    const paymentSubmit = () => {

        axios.post(`${Backend_url}/orders`, { ...buyItem, "cost": discountAmount, "discount": couponDiscount, "details": buyItem.details }).then(res => {
            setPTrigger(!productTrigger)
            window.alert("item Buyed successfully")
            removeFromCart()
        })


        setShowModal(false);
    }


    const [allBuyNames, setAllBuyNames] = useState([])
    const [allCost, setAllCost] = useState(0)
    const [showModal2, setShowModal2] = useState(false);






    const disHandler2 = (e) => {
        setDisCountAmount(allCost)
        coupons.map(c => {
            if (e.target.value === c.name) {

                if (new Date(c.s_date) > new Date() || new Date(c.e_date) < new Date()) {
                    window.alert('Coupon is not available for todays date')
                    e.target.value = ""
                }


                else {
                    const a = discountAmount - c.discount


                    setDisCountAmount(a)
                    setCouponDiscount(c.discount)
                }
            }

        })

    }

    const removeFromAllCart = (id, index) => {

        axios.delete(`${Backend_url}/cart/${id}`).then(res => {

            if (+index + 1 == all_products.length) {
                setShowModal2(false);
                setPTrigger(!productTrigger)
                navigate("/orders")
            }

        })



    }

    const paymentSubmit2 = async () => {
        // setShowModal2(false);
        all_products.map((a, index) => {

            axios.post(`${Backend_url}/orders`, { ...all_products[index], "cost": parseInt(all_products[index].cost) - parseInt(couponDiscount / all_products.length), "discount": couponDiscount, "details": all_products[index].details }).then(res => {

                removeFromAllCart(a.id, index)
            })



        })
    }




    const BuyAll = () => {
        setDisCountAmount(0)
        all_products.map(p => {
            setAllCost(prev => prev + p.cost)
            setP(prev => prev + 1)
            setDisCountAmount(prev => prev + p.cost)
        })
        setShowModal2(true)
    }

    return (
        <>


            <h1 style={{ marginLeft: "20px" }}>My Cart</h1>



            <Modal
                title={<span id='error' style={{ color: "red" }}></span>}
                centered
                visible={showModal}
                onOk={() => {
                    paymentSubmit()

                }}
                onCancel={() => {
                    setShowModal(false);
                    setNameOnCard('')
                    setMobile('')
                    setaddress('')
                    setExpiry('')
                    setZip('')
                    setSecurity('')
                    setCardNumber('')
                    

                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}
                okText="Buy"
                cancelText="Close"
            >

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Card Name</label>
                        <input type="text" value={nameonCard} onChange={e => {
                            if (isNaN(e.target.value)) {
                                setNameOnCard(e.target.value)
                                document.getElementById('error').textContent = ""
                            }
                            else {
                                document.getElementById('error').textContent = "Please enter string"
                                document.getElementById('expiry').value=""
                                 setExpiry("")

                                setNameOnCard("")
                            }
                        }
                        } className="disIn" placeholder='Name on card' />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Card Number</label>
                        <input type="number" value={cardNumber} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 13) {
                                    document.getElementById('error').textContent = "Please enter 13 digit card number"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setCardNumber(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 13 digit card number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder='Card Number' />
                    </div>
                </div>


                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }} >
                        <label>Expiry date</label>
                        <input type="month" id="expiry" onChange={e => {


                            const date1 = new Date()
                            const date2 = new Date(e.target.value)
                            if (
                                date1.getFullYear() >= date2.getFullYear() &&
                                date1.getMonth() > date2.getMonth() 
                            ) {
                                document.getElementById('error').textContent = "Card is expired"
                                
                                setExpiry("")
                               setBtnProps(true)
                              
                            } else {
                                document.getElementById('error').textContent = ""
                                setExpiry(e.target.value)
                                setBtnProps(false)
                                
                            }




                        }} className="disIn" placeholder="MM / YY" max="7" />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Security</label>
                        <input type="number" value={security} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 3) {
                                    document.getElementById('error').textContent = "Please enter 3 digit security number"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setSecurity(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 3 digit security number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder="security" />
                    </div>


                </div>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Address</label>
                    <input type="text" value={address} onChange={e => {
                        if(e.target.value !==''){
                            setaddress(e.target.value)
                            document.getElementById('error').textContent=""
                        }
                        else{
                            document.getElementById('error').textContent="Please enter string"
                            document.getElementById('expiry').value=""
                             setExpiry("")
                           
                            setaddress("")
                        }
                    }
                    } className="disIn" placeholder='Address' />
                </div>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Mobile Number</label>
                    <input type="number" value={mobile} onChange={e => {
                        if (e.target.value >= 0) {
                            if (e.target.value.length <= 10) {
                                document.getElementById('error').textContent = "Please enter 10 digit Mobile number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")
                                setMobile(e.target.value)
                            }
                            else {

                                document.getElementById('error').textContent = ""
                            }

                        }
                        else {
                            document.getElementById('error').textContent = "Please enter 10 Mobile  number"
                            document.getElementById('expiry').value=""
                             setExpiry("")


                        }
                    }} className="disIn" placeholder='Mobile Number' />
                </div>
                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>

                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label style={{ display: "block" }}>Zip/PostalCode</label>
                        <input type="number" value={zip} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 6) {
                                    document.getElementById('error').textContent = "Please enter 6 digit Zip"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setZip(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 6 digit Zip"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder="Zip" />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Coupon</label>
                        <input type="text" onChange={disHandler} className="disIn" placeholder='Add Coupon' />
                    </div>
                </div>
                <div style={{ fontSize: "16px", margin: "5px", marginTop: "10px" }}>Amount after applying Coupon: <span style={{ fontWeight: "600" }}>{discountAmount}</span></div>



            </Modal>


            <Modal
                title={`Payment for  ${all_products.map(f => f.name)}`}
                centered
                visible={showModal2}
                onOk={() => {
                    paymentSubmit2()

                }}
                onCancel={() => {
                    setShowModal2(false);
                    setShowModal(false);
                    setNameOnCard('')
                    setMobile('')
                    setaddress('')
                    setExpiry('')
                    setZip('')
                    setSecurity('')
                    setCardNumber('')

                }}

                okButtonProps={{ disabled: btnProps, color: "rgb(45, 45, 105)" }}
                okText="Buy"
                cancelText="Close"
            >
                <span id='error' style={{ color: "red" }}></span>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Card Name</label>
                        <input type="text" value={nameonCard} onChange={e => {
                            if (isNaN(e.target.value)) {
                                setNameOnCard(e.target.value)
                                document.getElementById('error').textContent = ""
                            }
                            else {
                                document.getElementById('error').textContent = "Please enter string"
                                document.getElementById('expiry').value=""
                                 setExpiry("")

                                setNameOnCard("")
                            }
                        }
                        } className="disIn" placeholder='Name on card' />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Card Number</label>
                        <input type="number" value={cardNumber} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 13) {
                                    document.getElementById('error').textContent = "Please enter 13 digit card number"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setCardNumber(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 13 digit card number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder='Card Number' />
                    </div>
                </div>


                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }} >
                        <label>Expiry date</label>
                        <input type="month" id="expiry" onChange={e => {


                            const date1 = new Date()
                            const date2 = new Date(e.target.value)
                            if (
                                date1.getFullYear() >= date2.getFullYear() &&
                                date1.getMonth() > date2.getMonth() 
                            ) {
                                document.getElementById('error').textContent = "Card is expired"
                                
                                setExpiry("")
                               setBtnProps(true)
                              
                            } else {
                                document.getElementById('error').textContent = ""
                                setExpiry(e.target.value)
                                setBtnProps(false)
                                
                            }




                        }} className="disIn" placeholder="MM / YY" max="7" />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Security</label>
                        <input type="number" value={security} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 3) {
                                    document.getElementById('error').textContent = "Please enter 3 digit security number"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setSecurity(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 3 digit security number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder="security" />
                    </div>


                </div>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Address</label>
                    <input type="text" value={address} onChange={e => {

if(e.target.value !==''){
                            setaddress(e.target.value)
                            document.getElementById('error').textContent=""
                        }
                        else{
                            document.getElementById('error').textContent="Please enter string"
                            document.getElementById('expiry').value=""
                             setExpiry("")
                           
                            setaddress("")
                        }

                    }
                    } className="disIn" placeholder='Address' />
                </div>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Mobile Number</label>
                    <input type="number" value={mobile} onChange={e => {
                        if (e.target.value >= 0) {
                            if (e.target.value.length <= 10) {
                                document.getElementById('error').textContent = "Please enter 10 digit Mobile number"
                                document.getElementById('expiry').value=""
                                 setExpiry("")
                                setMobile(e.target.value)
                            }
                            else {

                                document.getElementById('error').textContent = ""
                            }

                        }
                        else {
                            document.getElementById('error').textContent = "Please enter 10 Mobile  number"
                            document.getElementById('expiry').value=""
                             setExpiry("")


                        }
                    }} className="disIn" placeholder='Mobile Number' />
                </div>
                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>

                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label style={{ display: "block" }}>Zip/PostalCode</label>
                        <input type="number" value={zip} onChange={e => {
                            if (e.target.value >= 0) {
                                if (e.target.value.length <= 6) {
                                    document.getElementById('error').textContent = "Please enter 6 digit Zip"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setZip(e.target.value)
                                }
                                else {

                                    document.getElementById('error').textContent = ""
                                }

                            }
                            else {
                                document.getElementById('error').textContent = "Please enter 6 digit Zip"
                                document.getElementById('expiry').value=""
                                 setExpiry("")


                            }
                        }} className="disIn" placeholder="Zip" />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                        <label>Coupon</label>
                        <input type="text" onChange={disHandler2} className="disIn" placeholder='Add Coupon' />
                    </div>
                </div>
                <div style={{ fontSize: "16px", margin: "5px", marginTop: "10px" }}>Amount after applying Coupon: <span style={{ fontWeight: "600" }}>{discountAmount}</span></div>




            </Modal>



           
            {/* {all_products.length > 0 && <div style={{ margin: "auto", textAlign: "center", fontSize: "28px", marginTop: "20px" }}>Hey, <span style={{ textTransform: "capitalize" }}>{JSON.parse(localStorage.getItem('user')).name}</span> check Your Cart</div>} */}
            <div className='cardAll' >

                {all_products.length > 0 ?
                    <>
                        <div style={{ width: "1000px" }}>
                            <table class=" table table-bordered table-striped table-hover table-sm table- table-light">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">Product</th>

                                        <th scope="col">Name </th>
                                        <th scope="col">cost</th>
                                        <th scope="col">count </th>
                                        <th scope="col">Actions </th>
                                    </tr>
                                </thead>

                                {all_products.map(item => (
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
                                            <td><span style={{ padding: "8px", cursor: "pointer" }}
                                                onClick={e => removeItem(item.id)}><i class="fa-solid fa-trash" ></i></span>
                                                <span style={{ padding: "4px", cursor: "pointer"}}
                                                    onClick={e => checkoutHandle(item)}><i class="fa-solid fa-cart-shopping" ></i></span></td>

                                        </tr>
                                    </tbody>

                                    

                                ))}



                            </table>
                </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <button style={{ background: "orange", color: "black", padding: "8px", cursor: "pointer", float: "right", margin: "10px", outline: "0", border: "none",borderRadius:"10px",marginLeft:"900px",fontWeight:"bold" }}
                        onClick={BuyAll}     >Buy All</button>


                </div>



            </div>

                    </>
                    :
                    <div style={{ height: "72vh" }}><p>No Items are added in Cart</p></div>
                }

            </div>
        </>
    )
}

export default Cart