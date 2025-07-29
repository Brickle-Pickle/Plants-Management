import { useAppContext } from './context/app_context.jsx'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
// Common
import Navbar from './common/navbar.jsx'
import Footer from './common/footer.jsx'
// User Pages
import Dashboard from './user_pages/dashboard/dashboard.jsx'
import Login from './user_pages/login/login.jsx'
import Register from './user_pages/register/register.jsx'
import Plants from './user_pages/plants/plants.jsx'
import CareHistory from './user_pages/care-history/care_history.jsx'
import Reminders from './user_pages/reminders/reminders.jsx'
// Modals
import PlantsDelete from './user_pages/plants/plants_delete.jsx'
import PlantsEdit from './user_pages/plants/plants_edit.jsx'
import PlantsView from './user_pages/plants/plants_view.jsx'
import PlantsAdd from './user_pages/plants/plants_add.jsx'

function App() {
    const { location } = useAppContext();

    useEffect(() => {
        scrollTo(0, 0);
    }, [location]);

    return (
        <>
            { /* Modals */ }
            <PlantsDelete />
            <PlantsEdit />
            <PlantsView />
            <PlantsAdd />

            { /* Navbar */ }
            <Navbar />

            { /* Main Content */ }
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/plants" element={<Plants />} />
                <Route path="/care-history/:id" element={<CareHistory />} />
                <Route path="/reminders" element={<Reminders />} />
            </Routes>

            { /* Footer */ }
            <Footer />
        </>
    )
}

export default App