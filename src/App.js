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
        <ToastContainer
          position="top-right"
          autoClose={1000}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
          toastClassName="mt-4 mx-4 md:mx-0 rounded-xl shadow-lg border border-gray-100 font-sans"
          bodyClassName="text-sm font-medium text-gray-700 p-1"
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
