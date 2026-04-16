import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { Routers } from './routers';

function App() {
  return (
    <AuthProvider>
      <Routers />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
