import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  Search, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  User,
  Heart,
  Stethoscope,
  Calendar,
  Image,
  FileText,
  Smile,
  Mic,
  Circle
} from 'lucide-react';
import { messagingAPI } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    type: 'image' | 'document';
    name: string;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  doctorName: string;
  specialty: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    lastMessage: 'Your test results look good. Let\'s schedule a follow-up.',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    avatar: 'SJ',
    isOnline: true,
    messages: [
      {
        id: '1',
        sender: 'doctor',
        content: 'Hello John, I\'ve reviewed your recent blood work.',
        timestamp: '2:15 PM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'user',
        content: 'Hello Dr. Johnson! What do the results show?',
        timestamp: '2:20 PM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'doctor',
        content: 'Your cholesterol levels have improved since your last visit. The medication is working well.',
        timestamp: '2:25 PM',
        status: 'read'
      },
      {
        id: '4',
        sender: 'user',
        content: 'That\'s great news! Should I continue with the same dosage?',
        timestamp: '2:28 PM',
        status: 'read'
      },
      {
        id: '5',
        sender: 'doctor',
        content: 'Your test results look good. Let\'s schedule a follow-up.',
        timestamp: '2:30 PM',
        status: 'delivered'
      }
    ]
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Neurology',
    lastMessage: 'Please avoid caffeine for 24 hours before your EEG.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    avatar: 'MC',
    isOnline: false,
    messages: [
      {
        id: '1',
        sender: 'doctor',
        content: 'Your EEG is scheduled for next Tuesday at 10 AM.',
        timestamp: 'Yesterday, 4:30 PM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'user',
        content: 'Thank you! Is there anything I need to prepare?',
        timestamp: 'Yesterday, 4:35 PM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'doctor',
        content: 'Please avoid caffeine for 24 hours before your EEG.',
        timestamp: 'Yesterday, 4:40 PM',
        status: 'read'
      }
    ]
  },
  {
    id: '3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    lastMessage: 'The fever should subside in 2-3 days. Call if it worsens.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    avatar: 'ER',
    isOnline: false,
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'My daughter has a fever of 102°F. What should I do?',
        timestamp: '2 days ago, 6:15 PM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'doctor',
        content: 'You can give her children\'s Tylenol and ensure she stays hydrated.',
        timestamp: '2 days ago, 6:20 PM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'doctor',
        content: 'The fever should subside in 2-3 days. Call if it worsens.',
        timestamp: '2 days ago, 6:25 PM',
        status: 'read'
      }
    ]
  }
];

export default function Messaging() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await messagingAPI.getConversations();
        setConversations(data.conversations || mockConversations);
        if (data.conversations && data.conversations.length > 0) {
          setSelectedConversation(data.conversations[0]);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const data = await messagingAPI.getMessages(selectedConversation.id);
          // Update the selected conversation with fetched messages
          setSelectedConversation(prev => prev ? {
            ...prev,
            messages: data.messages || prev.messages
          } : null);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        // Send message via API
        await messagingAPI.sendMessage(selectedConversation.id, newMessage);
        
        // Optimistically update UI
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: 'user',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };

        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, newMsg],
              lastMessage: newMessage,
              lastMessageTime: 'Just now'
            };
          }
          return conv;
        });

        setConversations(updatedConversations);
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: 'Just now'
        });
        setNewMessage('');

        // Simulate message status updates
        setTimeout(() => {
          updateMessageStatus(newMsg.id, 'delivered');
        }, 1000);
        setTimeout(() => {
          updateMessageStatus(newMsg.id, 'read');
        }, 2000);
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const updateMessageStatus = (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    })));
    
    if (selectedConversation) {
      setSelectedConversation(prev => prev ? ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      }) : null);
    }
  };

  const getStatusIcon = (status?: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ConversationList = () => (
    <div className="w-full md:w-96 border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => {
              setSelectedConversation(conversation);
              // Mark messages as read
              setConversations(prev => prev.map(conv =>
                conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
              ));
            }}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center">
                  <span className="text-white font-semibold">{conversation.avatar}</span>
                </div>
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{conversation.doctorName}</h3>
                  <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{conversation.specialty}</p>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{conversation.unreadCount}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatWindow = () => {
    if (!selectedConversation) return null;

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center">
                  <span className="text-white font-semibold">{selectedConversation.avatar}</span>
                </div>
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.doctorName}</h3>
                <p className="text-sm text-gray-600">
                  {selectedConversation.isOnline ? 'Online' : 'Offline'} • {selectedConversation.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {selectedConversation.messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'order-2' : 'order-1'
              }`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'healthcare-gradient text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center space-x-1 mt-1 text-xs ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-gray-500">{message.timestamp}</span>
                  {message.sender === 'user' && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Image className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Smile className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 healthcare-gradient text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate securely with your healthcare providers</p>
        </div>

        <div className="healthcare-card p-0 h-[calc(100vh-200px)]">
          <div className="flex h-full">
            <ConversationList />
            <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  );
}
