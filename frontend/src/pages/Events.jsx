import { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import Header from '../components/Header'
import { AuthContext } from '../contexts/AuthContext'

export default function Events() {
	const [events, setEvents] = useState([])
	// estados para apostas em tempo real
	const [betInputs, setBetInputs] = useState({})       // amounts per event
	const [betOptions, setBetOptions] = useState({})     // option per event (home, draw, away)
	const [betsCart, setBetsCart] = useState([])         // apostas selecionadas
	const { refreshBalance, user } = useContext(AuthContext)

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
						<li key={evt.id} className="p-4 bg-white rounded shadow grid grid-cols-1 lg:grid-cols-5 justify-center items-center gap-4">
							<div className='flex md:block flex-col justify-center items-center col-span-1 lg:col-span-2'>
								<span className="font-semibold">{evt.name}</span>
								<div className="text-sm text-gray-600">
									<div className="text-center md:text-start font-bold">Odds:</div>
									<div className='flex flex-row gap-1'>
										<div className='bg-amber-300 rounded-2xl px-2'>casa: {evt.odd_home}</div>
										<div className='bg-amber-600 rounded-2xl px-2 text-white'>empate: {evt.odd_draw}</div>
										<div className='bg-amber-900 rounded-2xl px-2 text-white'>fora: {evt.odd_away}</div>
									</div>
								</div>
							</div>
							<div className='flex items-center justify-center md:justify-end gap-2 lg:gap-3 lg:col-span-3'>
								<div className='flex flex-col gap-2 lg:gap-3'>
									{/* Seleção de opção de aposta */}
									<select
										value={betOptions[evt.id] || ''}
										onChange={e => setBetOptions({ ...betOptions, [evt.id]: e.target.value })}
										className="border px-2 py-1 rounded"
									>
										<option value="">Escolha uma ODD</option>
										<option value="home">Casa ({evt.odd_home})</option>
										<option value="draw">Empate ({evt.odd_draw})</option>
										<option value="away">Fora ({evt.odd_away})</option>
									</select>
									<input
										type="Number"
										min="1"
										value={betInputs[evt.id] || ''}
										onChange={e => setBetInputs({ ...betInputs, [evt.id]: e.target.value })}
										placeholder="Valor em R$"
										className="border px-3 py-2 rounded w-full"
									/>
								</div>

								<div className='flex flex-col gap-2 lg:gap-3 border-l-2 pl-4'>
									<button
										onClick={() => {
											const amt = parseFloat(betInputs[evt.id]);
											const opt = betOptions[evt.id];
											if (amt > 0 && opt) {
												setBetsCart([...betsCart, { event: evt, amount: amt, selected_option: opt }]);
												setBetInputs({ ...betInputs, [evt.id]: '' });
												setBetOptions({ ...betOptions, [evt.id]: '' });
											}
										}}
										className="block px-4 py-2 bg-[#07102A] text-white rounded"
									>
										Adicionar
									</button>
									<span className='text-center p-0'>ou</span>
									{/* Botão de aposta única */}
									<button
										onClick={async () => {
											const amt = parseFloat(betInputs[evt.id])
											const opt = betOptions[evt.id]
											if (amt > 0 && opt) {
												try {
													await api.post('/bets', [{ event_id: evt.id, amount: amt, selected_option: opt }])
													alert('Aposta única realizada com sucesso!')
													setBetInputs({ ...betInputs, [evt.id]: '' })
													setBetOptions({ ...betOptions, [evt.id]: '' })
													refreshBalance()
												} catch (err) {
													let detail = err?.response?.data?.detail
													alert(detail || 'Erro ao enviar aposta')
												}
											}
										}}
										className="px-4 py-2 bg-green-500 text-white rounded"
									>
										Apostar Agora
									</button>
								</div>
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
								<li key={i} className="flex justify-between items-center">
									<div className="flex flex-col">
										<span>{b.event.name}</span>
										<span className="text-sm text-gray-600">
											Odd ({b.selected_option}): {b.event[`odd_${b.selected_option}`]}
										</span>
									</div>
									<span>R${b.amount.toFixed(2)}</span>
								</li>
							))}
						</ul>
						<div className="flex justify-between items-center">
							{user?.balance != null && (
								<span className="text-lg font-semibold">
									Saldo atual: R${user.balance.toFixed(2)}
								</span>
							)}
							<button
								onClick={async () => {
									try {
										// envia todas as apostas de uma vez como array
										await api.post('/bets', betsCart.map(b => ({ event_id: b.event.id, amount: b.amount })))
										alert('Todas as apostas realizadas com sucesso!')
										setBetsCart([])
										refreshBalance()
									} catch (err) {
										let detail = err?.response?.data?.detail
										alert(detail || 'Erro ao enviar apostas')
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
