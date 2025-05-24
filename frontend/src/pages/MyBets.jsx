import { useEffect, useState } from 'react'
import api from '../services/api'
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
			</div>
		</>
	)
}
