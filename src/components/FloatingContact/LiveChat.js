import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaSmile, FaRobot, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveChat = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Xin chào! DVN có thể giúp gì cho bạn hôm nay?', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleLoginRequired = () => {
    navigate('/login', { state: { from: location.pathname } });
    onClose();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: inputText, time: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate auto reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Cảm ơn bạn. Chuyên viên sẽ phản hồi bạn trong giây lát!',
        time: new Date()
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 w-[320px] sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 transform transition-all duration-300 origin-bottom-right">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaRobot size={20} className="text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Hỗ trợ trực tuyến</h3>
            <p className="text-blue-100 text-[11px]">Luôn sẵn sàng giải đáp</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
          <FaTimes size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 bg-gray-50 h-[300px] sm:h-[350px] overflow-y-auto flex flex-col gap-3">
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <FaUser size={28} />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Bạn chưa đăng nhập!</h4>
            <p className="text-sm text-gray-500 mb-6">Xin vui lòng đăng nhập để bắt đầu trò chuyện với chuyên viên tư vấn của DVN.</p>
            <button
              onClick={handleLoginRequired}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg w-full"
            >
              Đăng Nhập Ngay
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <FaRobot size={10} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Footer Input */}
      {isAuthenticated && (
        <div className="p-3 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex relative">
            <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
              <FaSmile size={18} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-12 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
            >
              <FaPaperPlane size={12} className="-ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
