import { useEffect, useRef, useState } from 'react'

import axios from "../api/axios"
import useAuth from "../hooks/useAuth"
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {

    const { setAuth, persist, setPersist } = useAuth()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/links"

    const navigate = useNavigate()

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })

    const [errMsg, setErrMsg] = useState('')

    const userRef = useRef()
    const errRef = useRef()

    useEffect(() => {

        if (userRef.current) userRef.current.focus()

    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [loginForm])

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setLoginForm(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const togglePersist = () => {
        setPersist( prevValue => !prevValue)
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post("/auth", {
                username: loginForm.username,
                password: loginForm.password
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(roles)
            setAuth({ username: loginForm.username, password: loginForm.password, roles, accessToken });

            setLoginForm({
                username: '',
                password: ''
            })

            navigate(from, { replace: true })

        } catch (error) {

            if (error.response) {

                if (error.response.status == 400) {
                    setErrMsg('Missing Username or Password');
                }
                if (error.response.status == 401) {
                    setErrMsg('Unauthorized');
                } else if (error.response?.status == 500) {
                    setErrMsg('Server Error')
                }


            } else if (error.request) {
                console.log(error.request);
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Login Failed')
                console.log('Error', error.message);
            }


            console.log(error.config);

            errRef.current.focus()

        }
    }

    return (
        <section className='login center-section'>

            <form onSubmit={handleSubmit}>
                <p ref={errRef} className={errMsg ? "err-msg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name='username'
                    ref={userRef}
                    autoComplete="off"
                    onChange={handleChange}
                    value={loginForm.username}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name='password'
                    onChange={handleChange}
                    value={loginForm.password}
                // required
                />
                <button>Sign In</button>
                <div>
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p>
                {/* Need an Account?<br />
                        <span className="line">
                            put router link here
                            <a href="#">Sign Up</a>
                        </span> */}
            </p>
        </section>
    )
}
