import { Link, useNavigate } from 'react-router-dom'
import useLogout from '../hooks/useLogout'

export default function () {

  const navigate = useNavigate()

  const logout = useLogout()

  const signOut = async () => {
    await logout()
    navigate("/links", {replace: true})
  }



  return (
    <section className='center-section'>
      <div>
        <h2>You are logged in!</h2>
        <Link to="/admin">Go to the Admin Page</Link>
        <br />
        <Link to="/editor">Go to the Editor Page</Link>
        <br />
        <Link to="/lounge">Go to the Lounge Page</Link>
        <br />
        <Link to="/links">Go to the link Page</Link>
        <br />
        <button onClick={signOut}>
          Logout
        </button>
      </div>
    </section>
  )
}
