import { Link } from 'react-router-dom'
import Employees from '../components/Employees'
export default function Admin() {

  return (
    <section className='center-section'>
      <div>
        <h2>Admin</h2>
        <Employees />
        <br />
        <Link to="/home">Homepage</Link>
      </div>

    </section>
  )
}
