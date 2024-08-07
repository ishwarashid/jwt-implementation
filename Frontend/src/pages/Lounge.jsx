import { Link } from 'react-router-dom'

export default function Lounge() {
  return (
    <section className='center-section'>
      <div>
        <h2>Lounge</h2>
        <Link to="/home">Homepage</Link>
      </div>
    </section>
  )
}
