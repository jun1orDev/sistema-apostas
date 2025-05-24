import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function MyBets() {
	const [bets, setBets] = useState([])

	useEffect(() => {
		api.get('/bets').then(res => setBets(res.data))
	}, [])

	const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0)
	const getStatusClass = (status) => {
		if (status === 'vencida') return 'bg-green-500'
		if (status === 'perdida') return 'bg-red-500'
		if (status === 'pendente') return 'bg-yellow-500'
		return 'bg-gray-500'
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl">Minhas Apostas</h1>
					<span className="text-lg">Total de Apostas: {bets.length}</span>
				</div>
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
					<>
						<ul className="space-y-2">
							{bets.map(bet => (
								<li key={bet.id} className="p-4 bg-white rounded shadow">
									<div className="flex justify-between items-center">
										<p>
											<span className='block'>{bet.event.name}</span>

											<span className='text-sm font-bold'>valor da aposta: R${bet.amount.toFixed(2)}</span>
										</p>
										<div className="flex items-center gap-2">
											<span className={`${getStatusClass(bet.status)} text-white px-2 py-1 rounded capitalize`}> {bet.status} </span>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="flex justify-start mt-4">
							<span className="font-semibold">
								Total gasto: R${totalAmount.toFixed(2)}
							</span>
						</div>
					</>
				)}
			</div>
		</>
	)
}
