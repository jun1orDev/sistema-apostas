import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Header from '../components/Header'
import { AuthContext } from '../contexts/AuthContext'

export default function Events() {
	const [events, setEvents] = useState([])
	// estados para apostas em tempo real
	const [betInputs, setBetInputs] = useState({})
	const [betOptions, setBetOptions] = useState({})
	const [betsCart, setBetsCart] = useState([])
	const [showCart, setShowCart] = useState(true)
	const [loading, setLoading] = useState(false)
	const { refreshBalance, user } = useContext(AuthContext)
	const navigate = useNavigate()
	// total de apostas no carrinho
	const totalCart = betsCart.reduce((sum, b) => sum + b.amount, 0)

	useEffect(() => {
		api.get('/events').then(res => setEvents(res.data))
	}, [])

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl"><span className='font-bold'>Próximos Eventos</span> <br /> <span className='font-light text-lg'>{user ? 'Seja bem-vindo, Bora apostar?' : 'Hoje é seu dia de sorte!'}</span></h1>
				</div>
				{/* Lista de eventos com inputs de aposta */}
				<ul className="space-y-4">
					{events.map(evt => (
						<li key={evt.id} className="p-4 bg-white rounded shadow grid grid-cols-1 lg:grid-cols-5 justify-center items-center gap-4">
							<div className='flex md:block flex-col justify-center items-center col-span-1 lg:col-span-2'>
								<div className='flex flex-col '>

									<span className="text-sm text-gray-500">Dia do Jogo: {new Date(evt.date_initial).toLocaleString()}</span>
									<span className="font-semibold">{evt.name}</span>
								</div>
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
												setShowCart(true);
												setBetInputs({ ...betInputs, [evt.id]: '' });
												setBetOptions({ ...betOptions, [evt.id]: '' });
											}
										}}
										className="block px-4 py-2 bg-[#213D78] text-white rounded"
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
												setLoading(true)
												try {
													await api.post('/bets', [{ event_id: evt.id, amount: amt, selected_option: opt }])
													alert('Aposta única realizada com sucesso!')
													setBetInputs({ ...betInputs, [evt.id]: '' })
													setBetOptions({ ...betOptions, [evt.id]: '' })
													refreshBalance()
												} catch (err) {
													let detail = err?.response?.data?.detail
													alert(detail || 'Erro ao enviar aposta')
												} finally {
													setLoading(false)
												}
											}
										}}
										disabled={loading}
										className={loading ? 'px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed' : 'px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded'}
									>
										{loading ? 'Apostando...' : 'Apostar Agora'}
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>

				{/* Carrinho de apostas */}
				{betsCart.length > 0 && showCart && (
					<div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-300 box-shadow ">
						<div className="flex justify-between items-center mb-2">
							<h3 className="font-semibold">Apostas Selecionadas:</h3>

							<button onClick={() => setShowCart(false)} className="text-green-500 hover:text-green-700 font-bold cursor-pointer">
								<div className='flex items-center gap-2 font-bold'>

									<svg xmlns="http://www.w3.org/2000/svg" className='font-bold' width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 3l18 0"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"></animate></path><path stroke-dasharray="16" stroke-dashoffset="16" d="M12 21l0 -13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" values="16;0"></animate></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7l4 4M12 7l-4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="8;0"></animate></path></g></svg>
									<p>

										Apostar mais
									</p>
								</div>
							</button>
						</div>
						<ul className="space-y-1 max-h-40 overflow-auto mb-2">
							{betsCart.map((b, i) => (
								<li key={i} className="flex justify-between items-center">
									<div className="flex flex-col">
										<span>{b.event.name}</span>
										<span className="text-sm text-gray-600">
											Odd ({b.selected_option}): {b.event[`odd_${b.selected_option}`]}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span>R${b.amount.toFixed(2)}</span>
										<div>
											<svg xmlns="http://www.w3.org/2000/svg"
												onClick={() => {
													setBetsCart(betsCart.filter((_, index) => index !== i))
												}} width="22" height="22" className='text-red-500 cursor-pointer' viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V6H4V4h5V3h6v1h5v2h-1v15zm2-2h10V6H7zm2-2h2V8H9zm4 0h2V8h-2zM7 6v13z" /></svg>
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className={`flex items-center ${user ? 'justify-between' : 'justify-end'}`}>
							{user?.balance != null && (
								<span className={`text-lg font-semibold ${totalCart > user.balance ? 'text-red-500' : 'text-green-600'}`}>
									Saldo atual: R${user.balance.toFixed(2)} <br /><small>{totalCart > user.balance ? 'saldo insuficiente' : ''}</small>
								</span>
							)}
							<div>
								<p className="text-sm text-gray-600 mb-2 text-end">Total: R$
									{totalCart}</p>
								<button
									onClick={async () => {
										// redireciona para login se não estiver autenticado
										if (!user) {
											navigate('/login')
											return
										}
										setLoading(true)
										try {
											// envia todas as apostas de uma vez como array
											await api.post('/bets', betsCart.map(b => ({ event_id: b.event.id, amount: b.amount, selected_option: b.selected_option })))
											alert('Todas as apostas realizadas com sucesso!')
											setBetsCart([])
											refreshBalance()
										} catch (err) {
											let detail = err?.response?.data?.detail
											alert(detail || 'Erro ao enviar apostas')
										} finally {
											setLoading(false)
										}
									}}
									disabled={loading}
									className={loading ? 'px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed' : 'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded'}
								>
									{loading ? 'Enviando...' : 'Enviar Apostas'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
