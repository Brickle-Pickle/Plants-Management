import { AppProvider } from './context/app_context.jsx'
// Common
import Navbar from './common/navbar.jsx'
// User Pages
import Dashboard from './user_pages/dashboard/dashboard.jsx'

function App() {
    return (
        <AppProvider>
			<Navbar />
			<Dashboard />
        </AppProvider>
    )
}

export default App