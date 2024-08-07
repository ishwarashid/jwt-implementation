import axios from '../api/axios'

import useAuth from './useAuth'

export default function UseRefreshToken () {

    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get("/refresh-token", {
            withCredentials: true
        })

        setAuth(prevValue => {

            return {
                ...prevValue,
                roles: response.data.roles,
                accessToken: response.data.accessToken
            }
        })

        return response.data.accessToken

    }
    return refresh

}
