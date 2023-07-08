import React, { useEffect, useState } from 'react'
import Backend_url from '../../Config'
import { Modal } from 'antd'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
const Product = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [no_of_items, setNoOfItems] = useState(1)
    const [one_product, setAllProduct] = useState({})
    const [nameonCard, setNameOnCard] = useState("")
    const [mobile, setMobile] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [zip, setZip] = useState("")
    const [address, setaddress] = useState("")

    const [buyItem, setBuuyItem] = useState({})

    
    const [totalCart, setTotalCart] = useState([])
    useEffect(() => {
       
        axios.get(`${Backend_url}/cart`).then(res => {
            
          setTotalCart(  res.data.filter(r => {
               
            return  r.email === JSON.parse(localStorage.getItem('user')).email && r.item_id === id
                 
              
          }))
        })
    }, [id])








    const [security, setSecurity] = useState("")
    useEffect(() => {
        axios.get(`${Backend_url}/products/${id}`).then(res => {
            setAllProduct(res.data)

        })
            .catch(err => {
                window.alert('error happen')
            })
    }, [])



    const cartAdd = () => {
        if (totalCart.length === 0) {
            axios.post(`${Backend_url}/cart/${JSON.parse(localStorage.getItem('user')).email}`, {

                "email":JSON.parse(localStorage.getItem('user')).email,
                "item_id": id,
                "name": one_product.name,
                "images": one_product.images,
                "category": one_product.category,
                "count": no_of_items,
                "details":one_product.details,
               
                "cost": no_of_items * one_product.cost,

            }).then(res => {
               window.alert("Item added to cart")
                navigate('/cart')
            }).catch(err => {
                window.alert(err)
            })
        }
        else {
            console.log(totalCart[0].id)
            axios.put(`${Backend_url}/cart`, {
                "id": totalCart[0].id,

                "email": JSON.parse(localStorage.getItem('user')).email,
                "item_id": id,
                "name": one_product.name,
                "images": one_product.images,
                "category": one_product.category,
                "details":one_product.details,
                "count": +no_of_items+(+totalCart[0].count),
                "cost": +(no_of_items * one_product.cost)+(parseInt(totalCart[0].cost)),


            }).then(res => {
             
                window.alert("Item added to cart")
                navigate('/cart')
            }).catch(err => {
                window.alert("Error Occurs")
            })
        }


    }



    const [coupons, setCoupons] = useState([])
    useEffect(() => {
        axios.get(`${Backend_url}/coupons`).then(res => {
            setCoupons(res.data)
        })
    }, [])

    const [discountAmount, setDisCountAmount] = useState(0)

    const [couponDiscount, setCouponDiscount] = useState(0)
    useEffect(() => {
        setDisCountAmount(one_product.cost * no_of_items)
    }, [no_of_items, one_product.cost])
    const [showModal, setShowModal] = useState(false);
    const buyNow = () => {
        setShowModal(true)
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





    const FinalBuy = () =>{
        axios.post(`${Backend_url}/orders`, {

            "email": JSON.parse(localStorage.getItem('user')).email,
            "item_id": id,
            "name": one_product.name,
            "images": one_product.images,
            "category": one_product.category,
            "count": no_of_items,
            "cost": discountAmount,
            "discount":couponDiscount,
           "details":one_product.details,
            "description":one_product.description,
            "pincode":zip
        }).then(res => {
            
            window.alert("item Buyed successfully")
            navigate('/orders')
        }).catch(err => {
            window.alert(err)
        })
    }
    const disHandler = (e) => {
        setDisCountAmount(one_product.cost * no_of_items)
        coupons.map(c => {
           
            if (e.target.value === c.name) {
                
                if (new Date(c.s_date) > new Date() || new Date(c.e_date) < new Date()) {
                    window.alert('Coupon is not available for todays date')
                    e.target.value = ""
                }


               else{
                const a = discountAmount - c.discount

                setDisCountAmount(a)
                setCouponDiscount(c.discount)
               }
            }

        })

    }
    return (
        <div style={{ marginLeft: "350px", display: "flex" }}>
         <Modal
                title={<span id='error' style={{color:"red"}}></span>}
                centered
                visible={showModal}
                onOk={() => {
                    FinalBuy()

                }}
                onCancel={() => {
                    setShowModal(false);
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
                        if(isNaN(e.target.value)){
                            setNameOnCard(e.target.value)
                            document.getElementById('error').textContent=""
                        }
                        else{
                            document.getElementById('error').textContent="Please enter string"
                            document.getElementById('expiry').value=""
                             setExpiry("")
                            setExpiry("")
                           
                            setNameOnCard("")
                        }
                        }
                        } className="disIn" placeholder='Name on card' />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Card Number</label>
                        <input type="number" value={cardNumber} onChange={e =>{
                            if(e.target.value>=0 ){
                                if( e.target.value.length<=13){
                                    document.getElementById('error').textContent="Please enter 13 digit card number"
                                    setCardNumber(e.target.value)
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                }
                                else{
                                   
                                    document.getElementById('error').textContent=""
                                   
                                }
                               
                            }
                            else{
                                document.getElementById('error').textContent="Please enter 13 digit card number"
                               
                               
                            }
                        }} className="disIn" placeholder='Card Number' />
                    </div>
                </div>


                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>
                <div style={{ fontSize: "16px", margin: "5px", width: "100%" }} >
                        <label>Expiry date</label>
                        <input type="month"  id="expiry" onChange={e => {


                            const date1 = new Date()
                            const date2 = new Date(e.target.value)
                            if (
                                date1.getFullYear() >= date2.getFullYear() &&
                                date1.getMonth() > date2.getMonth()
                            ) {
                                document.getElementById('error').textContent = "Card is expired"
                               setBtnProps(true)
                              
                            } else {
                                document.getElementById('error').textContent = ""
                                setBtnProps(false)
                                
                            }




                        }} className="disIn" placeholder="MM / YY" max="7" />
                    </div>
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label>Security</label>
                        <input type="number" value={security} onChange={e => {
                           if(e.target.value>=0 ){
                                if( e.target.value.length<=3){
                                    document.getElementById('error').textContent="Please enter 3 digit security number"
                                    setSecurity(e.target.value)
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                }
                                else{
                                   
                                    document.getElementById('error').textContent=""

                                }
                               
                            }
                            else{
                                document.getElementById('error').textContent="Please enter 3 digit security number"
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


                            }
                        }} className="disIn" placeholder='Mobile Number' />
                    </div>
                <div style={{ fontSize: "16px", display: "flex", gap: "10px" }}>
               
                    <div style={{ fontSize: "16px", margin: "5px", width: "100%" }}>
                    <label style={{display:"block"}}>Zip/PostalCode</label>
                        <input type="number" value={zip} onChange={e => {
                              if(e.target.value>=0 ){
                                if( e.target.value.length<=6){
                                    document.getElementById('error').textContent="Please enter 6 digit Zip"
                                    document.getElementById('expiry').value=""
                                     setExpiry("")
                                    setZip(e.target.value)
                                }
                                else{
                                   
                                    document.getElementById('error').textContent=""
                                }
                               
                            }
                            else{
                                document.getElementById('error').textContent="Please enter 6 digit Zip"
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

            <div
            >
                <img src={one_product.images} height={150}
                    width={150}
                    style={{ objectFit: "contain", borderRadius: "50%" }} alt="" />
                <div style={{ textAlign: "center", margin: "20px" }}>
                    <button style={{ background: "#6439ff", color: "white", padding: "8px", cursor: "pointer", border: "none", outline: "0",borderRadius: "10%"}} onClick={buyNow}>Buy Now</button>
                </div>
            </div>
            <div style={{}}>
                <div style={{ textAlign: "center", fontSize: "26px" }}>{one_product.name}</div>
                <div style={{ fontSize: "16px", margin: "10px" }}>{one_product.description}</div>
                <div style={{ fontSize: "16px", margin: "10px", textAlign: "center", fontSize: "28px" }}>&#8377;{one_product.cost * no_of_items}</div>
                <div style={{ textAlign: "center",position:"relative" }}>
                    Total items

                    <input type="number" onChange={e => {

                        if (e.target.value > 0) {
                            setNoOfItems(e.target.value)
                            e.target.nextElementSibling.textContent = ""
                        }
                        else {

                            e.target.nextElementSibling.textContent = "Please enter valid number"
                            e.target.value=""
                        }


                    }}
                        style={{ width: "90px", padding: "3px 5px", marginLeft: "5px" }}
                    />
                    <span style={{ color: "red",position:"absolute",left:"200px",width:"200px" }} ></span>



                </div>
                <div style={{ textAlign: "center", margin: "20px" }}>
                    <button style={{ background: "#6439ff", color: "white", padding: "8px", cursor: "pointer", border: "none", outline: "0", marginTop: "14px",borderRadius: "10%",borderRadius: "10%"}} onClick={cartAdd}>Add to cart</button>
                </div>

            </div>
        </div>
    )
}

export default Product