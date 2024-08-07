import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { Link } from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function Register() {

    const [regForm, setRegForm] = useState({
        username: '',
        password: '',
        matchPwd: ''
    })

    const [isValid, setIsValid] = useState({
        validUser: false,
        validPwd: false,
        validMatch: false
    })

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setRegForm(prevValue => {
            return { ...prevValue, [name]: value }
        })
    }

    const userRef = useRef()
    const errRef = useRef()


    const [userFocus, setUserFocus] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    const [success, setSuccess] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {

        userRef.current?.focus()

    }, [])

    useEffect(() => {

        setIsValid(prevValue => {
            return {
                ...prevValue,
                validUser: USER_REGEX.test(regForm.username)
            }
        })

    }, [regForm.username])

    useEffect(() => {

        setIsValid(prevValue => {
            return {
                ...prevValue,
                validPwd: PWD_REGEX.test(regForm.password),
                validMatch: regForm.password == regForm.matchPwd
            }
        })

    }, [regForm.password, regForm.matchPwd])

    useEffect( () => {
        setErrMsg('')
    }, [regForm.username, regForm.password, regForm.matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const v1 = USER_REGEX.test(regForm.username);
        const v2 = PWD_REGEX.test(regForm.password);
        const v3 = regForm.password === regForm.matchPwd

        if (!v1 && !v2 && !v3) {
            setErrMsg("Invalid Entry")
            return
        }

        try {
            const response = await axios.post("/register", JSON.stringify({ username: regForm.username, password: regForm.password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }

            )

            console.log(response.data)
            setSuccess(true)
            setRegForm({
                username: '',
                password: '',
                matchPwd: ''
            })
        } catch (error) {

            if (error.response) {
                if(error.response?.status == 409) {
                    setErrMsg('Username Taken');
                } else if (error.response?.status == 500) {
                    setErrMsg('Server Error')
                }


            } else if (error.request) {
                console.log(error.request);
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Registration Failed')
                console.log('Error', error.message);
            }
            console.log(error.config);

            errRef.current.focus()

        }
    }

    return (

        <>

            {success ? (
                <section className='register center-section'>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (

                <section className='register center-section'>
                    <form onSubmit={handleSubmit}>
                        <p ref={errRef} className={errMsg ? "err-msg" : "offscreen"} aria-live='assertive'>{errMsg}</p>

                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            required
                            ref={userRef}
                            autoComplete='off'
                            aria-describedby='uidnote'
                            aria-invalid={isValid.validUser ? false : true}
                            value={regForm.username}
                            onChange={handleChange}
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            className={isValid.validUser || !regForm.username ? "input-valid" : "input-invalid"}

                        />

                        <p id="uidnote" className={userFocus && regForm.username && !isValid.validUser ? 'instructions' : "offscreen"}>
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <label>Password:</label>
                        <input
                            type="password"
                            name='password'
                            required
                            value={regForm.password}
                            onChange={handleChange}
                            aria-describedby='pwdnote'
                            aria-invalid={isValid.validPwd ? false : true}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            className={isValid.validPwd || !regForm.password ? "input-valid" : "input-invalid"}
                        />
                        <p id="pwdnote" className={pwdFocus && regForm.password && !isValid.validPwd ? 'instructions' : "offscreen"}>
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name='matchPwd'
                            required
                            value={regForm.matchPwd}
                            onChange={handleChange}
                            aria-describedby='confirmnote'
                            aria-invalid={isValid.validMatch ? false : true}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            className={isValid.validMatch || !regForm.matchPwd ? "input-valid" : "input-invalid"}
                        />
                        <p id="confirmnote" className={matchFocus && regForm.matchPwd && !isValid.validMatch ? 'instructions' : "offscreen"}>
                            Must match the first password input field.
                        </p>
                        <button type='submit' disabled={isValid.validUser && isValid.validPwd && isValid.validMatch ? false : true}>Submit</button>
                        <Link to="/links">Links</Link>
                    </form>
                </section>
            )}

        </>

    )
}
