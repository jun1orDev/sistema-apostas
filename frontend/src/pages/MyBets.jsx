import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function MyBets() {
	const [bets, setBets] = useState([])

	useEffect(() => {
		api.get('/bets').then(res => setBets(res.data))
	}, [])

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-6">
				<h1 className="text-2xl mb-4">Minhas Apostas</h1>
				{bets.length === 0 ? (
					<div className="text-center py-6">
						<p className="mb-4">Você ainda não fez nenhuma aposta.</p>
						<Link
							to="/events"
							className="px-4 py-2 bg-blue-500 text-white rounded"
						>
							Ver Eventos
						</Link>
					</div>
				) : (
					<ul className="space-y-2">
						{bets.map(bet => (
							<li
								key={bet.id}
								className="p-4 bg-white rounded shadow flex justify-between"
							>
								<span>{bet.event.name}</span>
								<span>Valor: R${bet.amount.toFixed(2)}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	)
}
