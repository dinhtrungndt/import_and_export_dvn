import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Routers } from './routers';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routers />
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
