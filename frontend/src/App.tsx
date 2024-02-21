import './App.css';
import AuthenticationContextProvider from './context/AuthenticationContextProvider.tsx';
import Routing from './routing/Routing.tsx';

function App() {
    return (
        <AuthenticationContextProvider>
            <Routing />
        </AuthenticationContextProvider>
    );
}

export default App;
