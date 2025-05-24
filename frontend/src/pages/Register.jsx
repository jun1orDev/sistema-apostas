import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import api from '../services/api'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState(null)
	const { login } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		if (password !== confirmPassword) {
			setError('As senhas não coincidem')
			return
		}
		try {
			await api.post('/users', { email, password })
			// login automático após cadastro
			await login(email, password)
		} catch (err) {
			let detail = err?.response?.data?.detail
			if (Array.isArray(detail)) {
				detail = detail.map(e => e.msg).join(', ')
			} else if (typeof detail === 'object') {
				detail = JSON.stringify(detail)
			}
			setError(detail || 'Erro ao registrar')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md mx-auto bg-white shadow-md p-6 rounded">
				<div className="flex justify-center mb-4">
					<img src={logo} alt="Logo" className="h-16" />
				</div>
				<h2 className="text-xl font-bold mb-4">Criar Conta</h2>
				{error && <p className="text-red-500 mb-2">{error}</p>}
				<form onSubmit={handleSubmit}>
					<label className="block mb-2">
						Email
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</label>
					<label className="block mb-2">
						Senha
						<input
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</label>
					<label className="block mb-4">
						Confirmar Senha
						<input
							type="password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</label>
					<button type="submit" className="w-full bg-[#07102A] text-white py-2 rounded">
						Registrar
					</button>
				</form>
				<div className="mt-4 text-center">
					<Link to="/login" className="text-[#07102A] hover:underline">Já tem conta? Entrar</Link>
				</div>
			</div>
		</div>
	)
}
