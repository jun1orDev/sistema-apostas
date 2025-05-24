import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'

export default function Events() {
	const [events, setEvents] = useState([])

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
						<li
							key={evt.id}
							className="p-4 bg-white rounded shadow flex justify-between"
						>
							<span>{evt.name}</span>
							<span>Odds: {evt.odds}</span>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}
