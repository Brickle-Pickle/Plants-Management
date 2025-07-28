import { AppProvider } from './context/app_context.jsx'
import { Routes, Route } from 'react-router-dom'
// Common
import Navbar from './common/navbar.jsx'
import Footer from './common/footer.jsx'
// User Pages
import Dashboard from './user_pages/dashboard/dashboard.jsx'
// import Login from './user_pages/login/login.jsx'
// import Register from './user_pages/register/register.jsx'
// import Plants from './user_pages/plants/plants.jsx'
// import Reminders from './user_pages/reminders/reminders.jsx'

function App() {
    return (
        <AppProvider>
			<Navbar />

			<Routes>
				<Route path="/" element={<Dashboard />} />
				{ /* <Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/plants" element={<Plants />} />
				<Route path="/reminders" element={<Reminders />} /> */ }
			</Routes>

			<Footer />
        </AppProvider>
    )
}

export default App