import React from 'react'
import useAuth from './useAuth'
import axios from '../api/axios'

export default function useLogout() {

    const { setAuth } = useAuth()

    const logout = async () => {
        try {

            const response = await axios.get('/logout', {
                withCredentials: true
            })

            setAuth({})

        } catch(error) {
            console.log(error)
        }
    
    }

    return logout
}
