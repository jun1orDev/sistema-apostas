import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
	const { user } = useContext(AuthContext)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => setLoading(false), 50)
	}, [])

	if (loading) return null
	return user ? children : <Navigate to="/login" replace />
}
