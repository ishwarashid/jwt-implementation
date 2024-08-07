import { Link } from 'react-router-dom'

export default function Links() {
    return (
        <section className='center-section'>
            <div>
                <h2>Public</h2>
                <Link to="/register">Sign in</Link>
                <br />
                <Link to="/login">Login in</Link>
                <br />
                <h2>Protected</h2>
                <Link to="/home">Home</Link>
                <br />
                <Link to="/admin">Admin</Link>
                <br />
                <Link to="/editor">Editor</Link>
                <br />
                <Link to="/Lounge">Lounge</Link>
            </div>
        </section>
    )
}
