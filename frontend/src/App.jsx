import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Events from './pages/Events'
import MyBets from './pages/MyBets'
import Register from './pages/Register'

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Rotas públicas */}
					<Route path="/" element={<Events />} />
					<Route path="/events" element={<Events />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Rotas protegidas */}
					<Route
						path="/my-bets"
						element={
							<ProtectedRoute>
								<MyBets />
							</ProtectedRoute>
						}
					/>

					{/* Redireciona qualquer outra rota para eventos */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
