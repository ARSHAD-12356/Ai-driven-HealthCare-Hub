import { useState, useCallback } from 'react';

/**
 * Message interface for the chat system
 */
export interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

/**
 * useGeminiChat Hook
 * 
 * Handles all chat functionality including:
 * - Sending messages to Gemini API
 * - Managing message history
 * - Loading states
 * - Error handling
 * 
 * Usage:
 * const {
 *   messages,
 *   isLoading,
 *   error,
 *   sendMessage,
 *   clearMessages,
 * } = useGeminiChat();
 */
export function useGeminiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hello! I'm your AI health assistant. I'm here to help you with health guidance, symptom information, and general wellness advice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message to the Gemini API
   */
  const sendMessage = useCallback(
    async (userMessage: string) => {
      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        setError('Please enter a message');
        return;
      }

      // Clear previous errors
      setError(null);
      setIsLoading(true);

      // Add user message to chat
      const userMsg: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: userMessage.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        // Call the backend API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.trim(),
            conversationHistory: messages, // Send previous messages for context
          }),
        });

        const data = await response.json();

        // Handle API errors
        if (!response.ok) {
          throw new Error(
            data.error || `API Error: ${response.status} ${response.statusText}`
          );
        }

        // Handle success response
        if (!data.success) {
          throw new Error(data.error || 'Failed to get AI response');
        }

        // Add AI response to chat
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        // Handle errors
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);

        // Log error for debugging (only if there's actual error info)
        if (errorMessage && errorMessage !== 'An unexpected error occurred') {
          console.warn('Chat Error:', errorMessage);
        }

        // Add error message to chat
        const errorMsg: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          text: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  /**
   * Clear all messages and reset to initial state
   */
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        text: "Hello! I'm your AI health assistant. I'm here to help you with health guidance, symptom information, and general wellness advice. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  /**
   * Remove a specific message by ID
   */
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    removeMessage,
    clearError,
  };
}

/**
 * Alternative hook: useGeminiChatWithStreaming
 * This hook supports streaming responses from Gemini API
 * (implement if you want real-time message streaming)
 */
export function useGeminiChatWithStreaming() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hello! I'm your AI health assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage || userMessage.trim().length === 0) {
        setError('Please enter a message');
        return;
      }

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: userMessage.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      // Add placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        type: 'ai',
        text: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, aiMsg]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.trim(),
            conversationHistory: messages,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get response');
        }

        // Update the AI message with the complete response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, text: data.message, isLoading: false }
              : msg
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);

        // Update the AI message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
                  isLoading: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        text: "Hello! I'm your AI health assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
