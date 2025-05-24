import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route
						path="/events"
						element={
							<ProtectedRoute>
								<Events />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/my-bets"
						element={
							<ProtectedRoute>
								<MyBets />
							</ProtectedRoute>
						}
					/>

					{/* redireciona qualquer outro para /login */}
					<Route path="*" element={<Login />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
