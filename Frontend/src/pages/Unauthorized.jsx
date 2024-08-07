import { Link, useNavigate } from 'react-router-dom'

export default function Unauthorized() {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }
  return (
    <div>
        <h1>Unauthorized</h1>
        <button onClick={goBack}>Go back</button>
    </div>
  )
}
