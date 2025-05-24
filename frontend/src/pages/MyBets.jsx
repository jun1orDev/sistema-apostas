import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function MyBets() {
	const [bets, setBets] = useState([])
	const [filterStatus, setFilterStatus] = useState('all')
	const [filterDate, setFilterDate] = useState('all')

	useEffect(() => {
		api.get('/bets').then(res => setBets(res.data))
	}, [])

	// Filtra apostas por status e data
	const filteredBets = bets.filter(bet => {
		const statusOK = filterStatus === 'all' || bet.status === filterStatus
		let dateOK = true
		if (filterDate === 'today') {
			const betDate = new Date(bet.created_at)
			const today = new Date()
			dateOK = betDate.toDateString() === today.toDateString()
		} else if (filterDate === '7d') {
			dateOK = (new Date() - new Date(bet.created_at)) <= 7 * 24 * 60 * 60 * 1000
		} else if (filterDate === '30d') {
			dateOK = (new Date() - new Date(bet.created_at)) <= 30 * 24 * 60 * 60 * 1000
		}
		return statusOK && dateOK
	})
	const totalFilteredAmount = filteredBets.reduce((sum, b) => sum + b.amount, 0)
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
				</div>
				{/* Filtros de status e data */}
				{bets.length > 0 && (
					<div className="flex space-x-4 mb-4">
						<select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-2 py-1 border rounded">
							<option value="all">Todas as apostas</option>
							<option value="pendente">Pendente</option>
							<option value="vencida">Vencida</option>
							<option value="perdida">Perdida</option>
						</select>
						<select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="px-2 py-1 border rounded">
							<option value="all">Todas as datas</option>
							<option value="today">Hoje</option>
							<option value="7d">Últimos 7 dias</option>
							<option value="30d">Últimos 30 dias</option>
						</select>
					</div>
				)}

				{bets.length === 0 ? (
					<div className="text-center py-6">
						<p className="mb-4">Você ainda não fez nenhuma aposta.</p>
						<Link
							to="/events"
							className="px-4 py-2 bg-[#213D78] text-white rounded"
						>
							Ver Eventos
						</Link>
					</div>
				) : (
					<>
						{filteredBets.length === 0 ? (
							<div className="text-center py-6">
								<p className="mb-4">Nenhuma aposta encontrada para os filtros selecionados.</p>
							</div>
						) : (
							<>
								<ul className="space-y-2">
									{filteredBets.map(bet => (
										<li key={bet.id} className="p-4 bg-white rounded shadow">
											<div className="flex justify-between items-center">
												<div className='flex flex-col space-y-1'>

													<span className="text-xs text-gray-500">ID: {bet.id}</span>
													<span className="text-xs text-gray-500">Data da aposta: {new Date(bet.created_at).toLocaleString()}</span>
													<span className='block font-semibold'>{bet.event.name}</span>
													<span className='text-sm font-bold'>Valor da aposta: R${bet.amount.toFixed(2)}</span>
												</div>
												<div className="flex flex-col items-end space-y-1">
													<span className={`${getStatusClass(bet.status)} text-white px-2 py-1 rounded capitalize inline-block`}> {bet.status} </span>
													<span className="text-sm text-gray-700">Lucro: R${bet.profit.toFixed(2)}</span>
												</div>
											</div>
										</li>
									))}
								</ul>
								<div className="flex justify-between mt-4">
									<span className="font-semibold">
										Total gasto: R${totalFilteredAmount.toFixed(2)}
									</span>

									<span className="font-semibold">Total de Apostas: {bets.length}</span>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</>
	)
}
