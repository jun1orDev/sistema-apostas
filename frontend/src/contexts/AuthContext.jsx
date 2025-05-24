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
		if (!token) return
		const { sub, exp } = jwtDecoded.jwtDecode(token)
		if (Date.now() >= exp * 1000) {
			localStorage.removeItem('token')
			return
		}
		// busca dados do usuário para obter saldo
		; (async () => {
			try {
				const res = await api.get('/users/me')
				setUser({ id: sub, balance: res.data.balance })
			} catch {
				// token inválido ou erro ao buscar usuário
				logout()
			}
		})()
	}, [])

	// função para atualizar saldo do usuário
	const refreshBalance = async () => {
		try {
			const res = await api.get('/users/me')
			setUser(prev => prev ? { ...prev, balance: res.data.balance } : null)
		} catch {
			/* erro ao atualizar saldo */
		}
	}
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
			// obtém balance após login
			const resUser = await api.get('/users/me')
			setUser({ id: sub, balance: resUser.data.balance })
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
		<AuthContext.Provider value={{ user, login, logout, refreshBalance }}>
			{children}
		</AuthContext.Provider>
	)
}
