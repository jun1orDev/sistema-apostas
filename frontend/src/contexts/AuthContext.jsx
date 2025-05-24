import { createContext, useState, useEffect } from 'react'
import * as jwtDecoded from 'jwt-decode';
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const { sub, exp } = jwtDecoded.jwtDecode(token)
			if (Date.now() < exp * 1000) {
				setUser({ id: sub })
			} else {
				localStorage.removeItem('token')
			}
		}
	}, [])

	const login = async (email, password) => {
		const formData = new FormData();
		formData.append('username', email);
		formData.append('password', password);

		try {
			const response = await api.post('/auth/login', formData, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})

			const { access_token } = response.data
			localStorage.setItem('token', access_token)
			const { sub } = jwtDecoded.jwtDecode(access_token)
			setUser({ id: sub })
			navigate('/events')
		} catch ({ response }) {
			alert(response?.data?.detail)
			console.error(response?.data?.detail)
			return
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
		navigate('/login')
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
