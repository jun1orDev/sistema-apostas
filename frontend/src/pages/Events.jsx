import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'

export default function Events() {
	const [events, setEvents] = useState([])

	// estados para modal de aposta
	const [showModal, setShowModal] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState(null)
	const [betAmount, setBetAmount] = useState('')

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
				<ul className="space-y-2">
					{events.map(evt => (
						<li key={evt.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
							<div className="flex space-x-4">
								<span>{evt.name}</span>
								<span>Odds: {evt.odds}</span>
							</div>
							<button
								onClick={() => { setSelectedEvent(evt); setShowModal(true); }}
								className="px-3 py-1 bg-blue-500 text-white rounded"
							>
								Apostar
							</button>
						</li>
					))}
				</ul>

				{/* Modal de aposta */}
				{showModal && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
						<div className="bg-white p-6 rounded w-80">
							<h2 className="text-lg font-bold mb-4">Apostar em {selectedEvent.name}</h2>
							<input
								type="number"
								value={betAmount}
								onChange={e => setBetAmount(e.target.value)}
								placeholder="Valor da aposta"
								className="w-full border px-3 py-2 rounded mb-4"
							/>
							<div className="flex justify-end space-x-2">
								<button onClick={() => setShowModal(false)} className="px-3 py-1">Cancelar</button>
								<button
									onClick={async () => {
										try {
											await api.post('/bets', { event_id: selectedEvent.id, amount: parseFloat(betAmount) })
											alert('Aposta realizada com sucesso!')
										} catch (err) {
											alert(err.response?.data?.detail || 'Erro ao apostar')
										}
										setShowModal(false)
										setBetAmount('')
									}}
									className="px-3 py-1 bg-green-500 text-white rounded"
								>
									Confirmar
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
