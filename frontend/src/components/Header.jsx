import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)
	const { logout, user } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<header className="bg-white shadow">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<Link to="/events">
					<img src={logo} alt="Logo" className="h-8" />
				</Link>
				<nav>
					<div className="md:hidden">
						<button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 focus:outline-none">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
							</svg>
						</button>
					</div>
					<ul className={`flex-col md:flex md:flex-row md:space-x-4 ${isOpen ? 'flex' : 'hidden'} absolute bg-white right-4 mt-2 py-2 w-40 md:static md:mt-0 md:py-0 md:w-auto shadow md:shadow-none`}>
						{user && (
							<li className="flex items-center p-2">
								<span className="ml-2 text-green-600 font-semibold">
									Saldo: R${user.balance.toFixed(2)}
								</span>
							</li>
						)}
						<li>
							<Link to="/events" className="block px-4 py-2 hover:bg-gray-100">Eventos</Link>
						</li>
						<li>
							<Link to="/my-bets" className="block px-4 py-2 hover:bg-gray-100">Minhas Apostas</Link>
						</li>
						{user && (
							<li>
								<button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Sair</button>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	)
}
