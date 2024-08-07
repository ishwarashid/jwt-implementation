import { Link } from 'react-router-dom'

export default function Auth() {
    return (
        <section className='auth center-section'>
            <div>
                <h1>Welcome</h1>
                <div>
                    <button><Link to="register">Sign Up</Link></button>
                    <button><Link to="login">Sign In</Link></button>
                </div>
            </div>
        </section>
    )
}
