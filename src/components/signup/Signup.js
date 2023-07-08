import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Backend_url from '../../Config'
const Signup = () => {
    const [email, setEmail] = useState("")
    const [area, setArea] = useState("")
    const [phone, setPhone] = useState("")
    const [pincode, setPincode] = useState("")
    const [password, setPassword] = useState("")
    const [next, setNext] = useState(true)
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const navigate = useNavigate()

    const submitHandle = (e) => {
        e.preventDefault();
        
        axios.post(`${Backend_url}/users`,
            {
                "email": email,
                "name": name,

                "password": password,
                "role": "user"
            }).then(res => {
    
                navigate('/login')
            })
            .catch(err => {
                window.alert("Email already exists")
            })
    }
    return (
        <div class="login-page" >
        

            <div class="form" >

                <form class="login-form">
                <p>Signup Form</p>
                    <input type="email" placeholder="email@gmail.com" value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                            if (e.target.value === '' || !e.target.value.includes('@gmail.com')) {

                                e.target.style.border = "1px solid red"
                            }
                            else {
                                e.target.style.border = "1px solid green"
                            }

                        }} />

<input type="name" placeholder="name" value={name} pattern="\D" 
                        onChange={e => {
                            setName(e.target.value)

                            if (e.target.value === '' || !isNaN(e.target.value)) {


                               window.alert("No numbers")
                               e.targetvalue = ""
                               
                            }
                            else {
                                e.target.style.border = "1px solid green"
                            }

                        }} />
                    <input type="password" placeholder="length is more than 5" value={password}
                        onChange={e => {
                            setPassword(e.target.value)

                            if (e.target.value === '' || e.target.value.length < 6) {

                                e.target.style.border = "1px solid red"
                            }
                            else {
                                e.target.style.border = "1px solid green"
                            }

                        }} />
                    <div className="">


                        {(email === "" || !email.includes('@gmail.com') || password === ""  || name === "")
                            ?
                            <button

                                className="input-submit"

                                disabled
                                style={{ cursor: "not-allowed", width: "190px" }}
                            >Sign Up</button>
                            :
                            <button

                                className="input-submit"
                                style={{ width: "190px" }}
                                onClick={submitHandle}

                            >Sign Up</button>

                        }
                    </div>
                    <p class="message">Already registered? <Link to="/login" style={{ color: "blue" }}>Login</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Signup