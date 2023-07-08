import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import './login.css'
import axios from 'axios'
import Backend_url from '../../Config'
import { Link } from 'react-router-dom'

const Login = ({ setAuthTrigger, userTrigger, setUserTrigger }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const submitHandle = (e) => {
        e.preventDefault();


        axios.post(`${Backend_url}/login`, { "email": email, "password": password }).then(res => {
            localStorage.setItem('user', JSON.stringify(res.data))
            setAuthTrigger(true)
            setUserTrigger(!userTrigger)
            navigate('/products')
        }).catch(err => {
            window.alert("Check Credentials")
        })
    }
    return (
        <div class="login-page" >

            <div class="form" >

                <form class="login-form">
                    <p><b>Login </b></p>
                    <input type="email" placeholder="example@gmail.com" value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                            if (e.target.value === '' || !e.target.value.includes('@gmail.com')) {

                                e.target.style.border = "1px solid red"
                            }
                            else {
                                e.target.style.border = "1px solid green"
                            }

                        }} />
                    <input type="password" placeholder="Length is more than 5" onChange={e => {
                        setPassword(e.target.value)

                        if (e.target.value === '' || e.target.value.length < 6) {

                            e.target.style.border = "1px solid red"
                        }
                        else {
                            e.target.style.border = "1px solid green"
                        }

                    }} />
                    <div className="">

                        {email === '' || password === '' ?
                            <button

                                className="input-submit"

                                disabled
                                style={{ cursor: "not-allowed" }}
                            >Login</button>
                            :
                            <button

                                className="input-submit"

                                onClick={submitHandle}


                            >Login</button>}
                    </div>
                    <p class="message">Not registered? <Link to="/signup" style={{ color: "White" }}>Sign Up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login