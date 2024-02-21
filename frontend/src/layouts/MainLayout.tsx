import { Outlet } from 'react-router-dom';
import NavBar from '../components/nav/NavBar';
import Footer from '../components/footer/Footer.tsx';

export default function MainLayout() {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="overflow-y-auto flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
