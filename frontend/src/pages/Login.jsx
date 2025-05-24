import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Login() {
	const { user, login } = useContext(AuthContext)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	if (user) return <Navigate to="/events" replace />

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await login(email, password)
		} catch (err) {
			setError(err.response?.data?.detail || 'Erro ao fazer login')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md bg-white shadow-md p-6 rounded">
				<div className="flex justify-center mb-4">
					<img src={logo} alt="Logo" className="h-16" />
				</div>
				<h2 className="text-xl font-bold mb-4">Login</h2>
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
					<label className="block mb-4">
						Senha
						<input
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					</label>
					<button
						type="submit"
						className="w-full bg-[#213D78] text-white py-2 rounded cursor-pointer"
					>
						Entrar
					</button>
				</form>
				<div className="mt-4 text-center">
					<Link
						to="/register"
						className="text-[#213D78] hover:underline"
					>
						Não tem conta? Cadastre-se
					</Link>
				</div>
			</div>
		</div>
	)
}
