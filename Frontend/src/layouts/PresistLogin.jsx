import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import UseRefreshToken from '../hooks/UseRefreshToken'

export default function PresistLogin() {

    const { auth, persist } = useAuth()
    const refresh = UseRefreshToken()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                console.log("verify rt")

                await refresh()

            } catch (error) {

                console.log("hhhh")

                console.error(error)

            } finally {

                isMounted && setIsLoading(false)

            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

        return () => isMounted = false

    }, [])


    useEffect(() => {

        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)

    }, [isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}
