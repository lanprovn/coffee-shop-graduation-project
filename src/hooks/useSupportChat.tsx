/**
 * Customer Support Chat System - Frontend only
 * Live chat simulation với bot responses
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const CHAT_HISTORY_KEY = 'coffee-shop-chat-history';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick_reply' | 'suggestion';
}

export interface QuickReply {
  text: string;
  value: string;
}

export function useSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsedMessages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } else {
        // Initialize with welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Bot responses based on keywords
  const getBotResponse = useCallback((userMessage: string): ChatMessage[] => {
    const message = userMessage.toLowerCase();
    const responses: ChatMessage[] = [];

    // Greeting responses
    if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Xin chào! Tôi rất vui được hỗ trợ bạn. Bạn cần giúp gì?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Product questions
    else if (message.includes('sản phẩm') || message.includes('cà phê') || message.includes('menu')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Chúng tôi có nhiều loại cà phê và đồ uống. Bạn có thể xem menu tại trang sản phẩm hoặc tôi có thể giới thiệu một số món phổ biến.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
      responses.push({
        id: `bot_${Date.now()}_2`,
        text: 'Một số sản phẩm được yêu thích:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestion'
      });
    }
    // Order questions
    else if (message.includes('đặt hàng') || message.includes('order') || message.includes('mua')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Để đặt hàng, bạn có thể: 1) Thêm sản phẩm vào giỏ hàng, 2) Chọn phương thức giao hàng, 3) Thanh toán. Bạn cần hỗ trợ gì cụ thể?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Delivery questions
    else if (message.includes('giao hàng') || message.includes('delivery') || message.includes('ship')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Chúng tôi giao hàng trong bán kính 5km với phí giao hàng 5.000đ. Đơn hàng từ 100.000đ được miễn phí giao hàng. Thời gian giao hàng: 15-30 phút.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Payment questions
    else if (message.includes('thanh toán') || message.includes('payment') || message.includes('tiền')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Chúng tôi hỗ trợ thanh toán: Tiền mặt, KBZ Pay, Wave Money. Bạn có thể thanh toán khi nhận hàng hoặc thanh toán online.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Store questions
    else if (message.includes('cửa hàng') || message.includes('store') || message.includes('địa chỉ')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Chúng tôi có 12 chi nhánh tại TP.HCM. Bạn có thể xem danh sách cửa hàng và địa chỉ tại trang "Cửa hàng". Bạn ở khu vực nào?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Hours questions
    else if (message.includes('giờ') || message.includes('mở cửa') || message.includes('time')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Cửa hàng mở cửa từ 6:00 - 22:00 hàng ngày. Dịch vụ giao hàng hoạt động từ 7:00 - 21:00.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Complaints
    else if (message.includes('phàn nàn') || message.includes('complaint') || message.includes('không hài lòng')) {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Tôi rất tiếc về trải nghiệm không tốt của bạn. Vui lòng cho tôi biết chi tiết vấn đề để tôi có thể hỗ trợ tốt nhất.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }
    // Default response
    else {
      responses.push({
        id: `bot_${Date.now()}_1`,
        text: 'Tôi hiểu bạn đang hỏi về: "' + userMessage + '". Để tôi hỗ trợ tốt nhất, bạn có thể hỏi về: sản phẩm, đặt hàng, giao hàng, thanh toán, cửa hàng.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      });
    }

    return responses;
  }, []);

  // Send message
  const sendMessage = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveChatHistory(newMessages);
      return newMessages;
    });

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botResponses = getBotResponse(text);
      setMessages(prev => {
        const newMessages = [...prev, ...botResponses];
        saveChatHistory(newMessages);
        return newMessages;
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  }, [getBotResponse, saveChatHistory]);

  // Send quick reply
  const sendQuickReply = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  // Clear chat history
  const clearChatHistory = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  }, [saveChatHistory]);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setUnreadCount(0);
      }
      return !prev;
    });
  }, []);

  // Increment unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  return {
    isOpen,
    messages,
    isTyping,
    unreadCount,
    sendMessage,
    sendQuickReply,
    clearChatHistory,
    toggleChat
  };
}

/**
 * Support Chat Widget Component
 */
export function SupportChatWidget() {
  const { 
    isOpen, 
    messages, 
    isTyping, 
    unreadCount, 
    sendMessage, 
    sendQuickReply, 
    clearChatHistory, 
    toggleChat 
  } = useSupportChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const quickReplies = [
    'Xem menu',
    'Đặt hàng như thế nào?',
    'Phí giao hàng bao nhiêu?',
    'Giờ mở cửa',
    'Địa chỉ cửa hàng'
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40"
        >
          <div className="relative">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs opacity-90">Trực tuyến</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Câu hỏi thường gặp:</p>
              <div className="flex flex-wrap gap-1">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => sendQuickReply(reply)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </form>
            
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={clearChatHistory}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Xóa lịch sử
              </button>
              <p className="text-xs text-gray-500">
                Phản hồi trong vài giây
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
