import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Employees() {

    const [employees, setEmployees] = useState([])

    const privateAxios = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {

        let isMounted = true
        const controller = new AbortController()

        const getEmployees = async () => {
            try {

                const response = await privateAxios.get("/employees", {
                    signal: controller.signal
                })

                console.log(response.data)

                isMounted && setEmployees(response.data);


            } catch (error) {
                
                if (error.code!=="ERR_CANCELED") {
                    navigate("/login", { state: { from: location }, replace: true })
                    console.error(error)
                }

            }
        }

        getEmployees()

        return () => {
            isMounted = false
            controller.abort()
        }

    }, [privateAxios, navigate, location])


    return (
        <article>
            {
                employees.length ? (
                    <ul>

                        {employees.map((employee, index) => (

                            <li key={index}>{employee.firstname}</li>

                        ))}

                    </ul>

                ) : (
                    <p>No users to display!</p>
                )
            }
        </article>
    )
}
