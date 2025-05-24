import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'

export default function Events() {
	const [events, setEvents] = useState([])
	// estados para apostas em tempo real
	const [betInputs, setBetInputs] = useState({})       // amounts per event
	const [betsCart, setBetsCart] = useState([])         // apostas selecionadas

	useEffect(() => {
		api.get('/events').then(res => setEvents(res.data))
	}, [])

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl">Eventos</h1>
				</div>
				{/* Lista de eventos com inputs de aposta */}
				<ul className="space-y-4">
					{events.map(evt => (
						<li key={evt.id} className="p-4 bg-white rounded shadow grid grid-cols-2 lg:grid-cols-3 items-center gap-4">
							<div className='lg:col-span-2'>
								<span className="font-semibold">{evt.name}</span>
								<div className="text-sm text-gray-600">Odds: {evt.odds}</div>
							</div>
							<div className='flex items-center gap-2 lg:gap-8'>
								<input
									type="Number"
									min="1"
									value={betInputs[evt.id] || ''}
									onChange={e => setBetInputs({ ...betInputs, [evt.id]: e.target.value })}
									placeholder="Valor em R$"
									className="border px-3 py-2 rounded w-full"
								/>
								<button
									onClick={() => {
										const amt = parseFloat(betInputs[evt.id]);
										if (amt > 0) {
											setBetsCart([...betsCart, { event: evt, amount: amt }]);
											setBetInputs({ ...betInputs, [evt.id]: '' });
										}
									}}
									className="px-4 py-2 bg-blue-500 text-white rounded"
								>
									Adicionar
								</button>
							</div>
						</li>
					))}
				</ul>

				{/* Carrinho de apostas */}
				{betsCart.length > 0 && (
					<div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
						<h3 className="font-semibold mb-2">Apostas Selecionadas:</h3>
						<ul className="space-y-1 max-h-40 overflow-auto mb-2">
							{betsCart.map((b, i) => (
								<li key={i} className="flex justify-between">
									<span>{b.event.name}</span>
									<span>R${b.amount.toFixed(2)}</span>
								</li>
							))}
						</ul>
						<div className="flex justify-end">
							<button
								onClick={async () => {
									try {
										await Promise.all(
											betsCart.map(b => api.post('/bets', { event_id: b.event.id, amount: b.amount }))
										)
										alert('Apostas realizadas com sucesso!')
										setBetsCart([])
									} catch (err) {
										alert('Erro ao enviar apostas', err.response?.data?.detail || 'Tente novamente mais tarde')
									}
								}}
								className="px-4 py-2 bg-green-600 text-white rounded"
							>
								Enviar Apostas
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
