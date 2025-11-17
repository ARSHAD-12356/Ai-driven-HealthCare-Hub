'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Plus, Trash2, Volume2, VolumeX, Edit2, Share2, Check, X } from 'lucide-react';
import { useGeminiChat, Message as ChatMessage } from '@/hooks/use-gemini-chat';
import { LanguageSelector, type SupportedLanguage } from './language-selector';

// Type for speech recognition
type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export default function ChatInterface({ onBack }: { onBack?: () => void }) {
  const { messages: hookMessages, isLoading, error, sendMessage, clearError } = useGeminiChat();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en-US');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isVoiceInput, setIsVoiceInput] = useState(false); // Track if current input is from voice
  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(null);
  const transcriptRef = useRef<string>('');
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Get patient name for welcome message
  const getPatientName = (): string => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const firstName = user.fullName?.split(' ')[0] || 'Friend';
        return firstName;
      }
    } catch (error) {
      console.error('Error loading patient name:', error);
    }
    return 'Friend';
  };

  // Load chats from localStorage on mount
  const loadChatsFromStorage = (): Chat[] => {
    try {
      const savedChats = localStorage.getItem('healthcare_chats');
      if (savedChats) {
        const parsed = JSON.parse(savedChats);
        return parsed.map((chat: any) => ({
          ...chat,
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(chat.createdAt),
        }));
      }
    } catch (error) {
      console.error('Error loading chats from storage:', error);
    }
    const patientName = getPatientName();
    return [
    {
      id: '1',
      name: 'New Chat',
        messages: [
          {
            id: '1',
            type: 'ai',
            text: `👋 Hello ${patientName}! I'm your AI health assistant. How can I help you today?`,
            timestamp: new Date(),
          },
        ],
      createdAt: new Date(),
    },
    ];
  };

  const [chats, setChats] = useState<Chat[]>(loadChatsFromStorage);
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id || '1');
  const [input, setInput] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatName, setEditingChatName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    try {
      localStorage.setItem('healthcare_chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to storage:', error);
    }
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Update active chat with latest messages from hook
  useEffect(() => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: hookMessages }
          : chat
      )
    );
  }, [hookMessages, activeChatId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak AI responses
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    if (!synthRef.current) {
      synthRef.current = window.speechSynthesis;
    }

    // Stop any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (error) => {
        // Only log actual errors, not empty error objects
        if (error && error.error) {
          console.warn('Speech synthesis error:', error.error);
        }
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error creating speech utterance:', error);
      setIsSpeaking(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Speak latest AI message when it arrives
  useEffect(() => {
    if (activeChat?.messages && activeChat.messages.length > 0 && !isLoading && voiceEnabled) {
      const lastMessage = activeChat.messages[activeChat.messages.length - 1];
      // Don't speak the welcome message
      if (lastMessage.type === 'ai' && activeChat.messages.length > 1) {
        // Always speak AI responses when voice is enabled (except welcome message)
        const timeoutId = setTimeout(() => {
          speakText(lastMessage.text);
        }, 500);
        setIsVoiceInput(false); // Reset flag after speaking
        return () => clearTimeout(timeoutId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.messages, isLoading, voiceEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          // For final results, append only if not already added
          if (!transcriptRef.current.includes(transcript)) {
            transcriptRef.current += transcript + ' ';
          }
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input field with cumulative transcript
      const fullTranscript = transcriptRef.current + interimTranscript;
      setInput(fullTranscript);
      setVoiceTranscript(fullTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      // Don't log 'aborted' as an error - it's intentional when stopping
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-close popup after a short delay if not manually closed
      setTimeout(() => {
        setShowVoicePopup(false);
      }, 1000);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLanguage]);

  // Update recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    stopSpeaking(); // Stop any ongoing speech when sending new message
    const wasVoiceInput = isVoiceInput;
    sendMessage(input);
    setInput('');
    setShowVoicePopup(false);
    stopListening();
    // Keep isVoiceInput flag until AI responds, then reset it
  };

  const startListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    try {
      // Reset transcript for new session
      transcriptRef.current = '';
      setVoiceTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Could not start speech recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setShowVoicePopup(false);
    } else {
      setIsVoiceInput(true); // Mark that this will be a voice input
      setShowVoicePopup(true);
      startListening();
    }
  };

  const createNewChat = () => {
    const patientName = getPatientName();
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + 1}`,
      messages: [
        {
          id: '1',
          type: 'ai',
          text: `👋 Hello ${patientName}! I'm your AI health assistant. How can I help you today?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id: string) => {
    if (chats.length === 1) return;
    if (confirm('Are you sure you want to delete this chat?')) {
    const updatedChats = chats.filter((c) => c.id !== id);
    setChats(updatedChats);
    if (activeChatId === id) {
      setActiveChatId(updatedChats[0].id);
      }
    }
  };

  const editChatName = (id: string, newName: string) => {
    if (newName.trim()) {
      setChats(chats.map((c) => (c.id === id ? { ...c, name: newName.trim() } : c)));
      setEditingChatId(null);
      setEditingChatName('');
    }
  };

  const shareChat = (chat: Chat) => {
    const chatData = {
      name: chat.name,
      messages: chat.messages,
      createdAt: chat.createdAt,
    };
    const shareText = `HealthCare Hub Chat: ${chat.name}\n\n${chat.messages.map(m => `${m.type === 'user' ? 'You' : 'AI'}: ${m.text}`).join('\n\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: `HealthCare Hub Chat: ${chat.name}`,
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Chat copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Chat copied to clipboard!');
    }
  };

  if (!activeChat) return null;

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-xl">
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50">
          {onBack && (
            <button
              onClick={onBack}
              className="text-primary font-semibold text-sm flex items-center gap-2 hover:text-primary/80 mb-4 w-full px-3 py-2 hover:bg-primary/5 rounded-xl transition-all"
            >
              ← Back
            </button>
          )}
          <button
            onClick={createNewChat}
            className="w-full py-3 bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 rounded-xl transition-all group ${
                activeChatId === chat.id
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/50 shadow-lg'
                  : 'bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {editingChatId === chat.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingChatName}
                    onChange={(e) => setEditingChatName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        editChatName(chat.id, editingChatName);
                      }
                    }}
                    className="flex-1 px-2 py-1 rounded-lg bg-background border border-primary text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => editChatName(chat.id, editingChatName)}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingChatId(null);
                      setEditingChatName('');
                    }}
                    className="p-1.5 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => setActiveChatId(chat.id)}
                    className="cursor-pointer"
                  >
                    <p className="font-bold text-sm text-foreground truncate mb-1">
                  {chat.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                      {chat.messages[chat.messages.length - 1]?.text.slice(0, 40) || 'New chat'}...
                </p>
              </div>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(chat.id);
                        setEditingChatName(chat.name);
                      }}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Edit chat name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareChat(chat);
                      }}
                      className="p-1.5 text-accent hover:bg-accent/10 rounded-lg transition-all"
                      title="Share chat"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="Delete chat"
              >
                      <Trash2 className="w-3.5 h-3.5" />
              </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-purple-50/20 dark:from-slate-950/50 dark:via-slate-900/50 dark:to-slate-950/50 backdrop-blur-xl">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message - Centered and only shows when no user messages */}
          {activeChat.messages.length === 1 && activeChat.messages[0].type === 'ai' && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border-2 border-primary/30 rounded-3xl p-8 max-w-lg text-center shadow-2xl backdrop-blur-xl">
                <div className="text-5xl mb-4">👋</div>
                <p className="text-2xl font-extrabold text-foreground mb-2">
                  {activeChat.messages[0].text}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Type your question below or use the microphone for voice input
                </p>
              </div>
            </div>
          )}
          {/* Regular Messages */}
          {activeChat.messages
            .filter((msg, idx) => !(idx === 0 && msg.type === 'ai' && activeChat.messages.length === 1))
            .map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl shadow-xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white'
                    : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-foreground border-2 border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-2 ${
                  msg.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-muted text-foreground rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-destructive/10 text-destructive rounded-lg max-w-xs lg:max-w-md">
                <p className="text-sm font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={clearError}
                  className="text-xs mt-2 underline hover:no-underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Input Popup - Circular Design */}
        {showVoicePopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-primary/30 rounded-full p-12 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse scale-110' 
                      : 'bg-gradient-to-br from-primary to-accent'
                  } shadow-2xl`}>
                    {isListening ? (
                      <>
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                        <MicOff className="w-16 h-16 text-white relative z-10" />
                      </>
                    ) : (
                      <Mic className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-foreground mb-2">
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isListening 
                      ? 'Speak your question now. Click mic again to stop.' 
                      : 'Click the mic button to start listening'}
                  </p>
                </div>
                {(voiceTranscript || input) && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-foreground font-medium">
                      {voiceTranscript || input}
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      stopListening();
                      setShowVoicePopup(false);
                      transcriptRef.current = '';
                      setVoiceTranscript('');
                    }}
                    className="flex-1 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  {(voiceTranscript || input) && (
                    <button
                      onClick={() => {
                        const finalText = voiceTranscript || input;
                        setInput(finalText);
                        transcriptRef.current = finalText;
                        setIsVoiceInput(true); // Mark as voice input
                        handleSendMessage();
                        transcriptRef.current = '';
                        setVoiceTranscript('');
                      }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-xl transition-all"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl space-y-4">
          {/* Language and Voice Controls */}
          <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-2 items-center">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Language:
            </span>
            <LanguageSelector
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              disabled={isLoading}
            />
            </div>
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  setVoiceEnabled(!voiceEnabled);
                }
              }}
              className={`p-2.5 rounded-xl transition-all ${
                isSpeaking
                  ? 'bg-red-500/20 text-red-500 animate-pulse'
                  : voiceEnabled
                  ? 'bg-primary/20 text-primary hover:bg-primary/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title={isSpeaking ? 'Stop speaking' : voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Text Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isListening ? "Listening..." : "Ask me anything about your health... (Shift+Enter for new line)"}
                disabled={isLoading}
                rows={2}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700/50 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none pr-14 transition-all"
              />
              {/* Mic Button */}
              <button
                onClick={handleMicClick}
                disabled={isLoading || !speechSupported}
                title={speechSupported ? (isListening ? "Stop listening" : "Start listening") : "Speech recognition not supported"}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse shadow-lg"
                    : speechSupported
                    ? "text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary"
                    : "text-muted-foreground/50 cursor-not-allowed"
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all self-end flex items-center gap-2"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}