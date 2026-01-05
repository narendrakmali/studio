'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addRequest } from '@/lib/data';
import { TransportRequest } from '@/lib/types';

type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
};

type RequestType = 'indoor' | 'outdoor';

type ConversationState = {
  step: number;
  data: Partial<{
    userName: string;
    contactNumber: string;
    departmentName: string;
    vehicleType: string;
    destination: string;
    passengerCount: number;
    durationFrom: Date;
    durationTo: Date;
    requestType: string;
    source: string;
  }>;
};

const INDOOR_QUESTIONS = [
  { field: 'userName', question: 'What is your name?', validate: (val: string) => val.length >= 2 },
  { field: 'contactNumber', question: 'What is your contact number?', validate: (val: string) => val.length >= 10 },
  { field: 'departmentName', question: 'What is your department name?', validate: (val: string) => val.length >= 2 },
  { 
    field: 'vehicleType', 
    question: 'What type of vehicle do you need? (Options: two-wheeler, four-wheeler, tempo, eicher, bus)',
    validate: (val: string) => ['two-wheeler', 'four-wheeler', 'tempo', 'eicher', 'bus'].includes(val.toLowerCase())
  },
  { field: 'destination', question: 'What is your destination?', validate: (val: string) => val.length >= 1 },
  { field: 'passengerCount', question: 'How many passengers?', validate: (val: string) => !isNaN(Number(val)) && Number(val) >= 1 },
  { field: 'durationFrom', question: 'Start date? (Format: YYYY-MM-DD)', validate: (val: string) => !isNaN(Date.parse(val)) },
  { field: 'durationTo', question: 'End date? (Format: YYYY-MM-DD)', validate: (val: string) => !isNaN(Date.parse(val)) },
];

export function RequestChatbot({ requestType = 'indoor' }: { requestType?: RequestType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: -1,
    data: {},
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && conversationState.step === -1) {
      startConversation();
    }
  }, [isOpen]);

  const addMessage = (role: 'bot' | 'user', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const startConversation = () => {
    const greeting = `Hi! I'm here to help you request a ${requestType} vehicle. Let's get started!`;
    addMessage('bot', greeting);
    setTimeout(() => {
      addMessage('bot', INDOOR_QUESTIONS[0].question);
      setConversationState({ step: 0, data: {} });
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isCompleted) return;

    const userInput = input.trim();
    addMessage('user', userInput);
    setInput('');

    // Process the answer
    processAnswer(userInput);
  };

  const processAnswer = (answer: string) => {
    const currentQuestion = INDOOR_QUESTIONS[conversationState.step];
    
    // Validate the answer
    if (!currentQuestion.validate(answer)) {
      setTimeout(() => {
        addMessage('bot', `Sorry, that doesn't seem valid. ${currentQuestion.question}`);
      }, 500);
      return;
    }

    // Store the answer
    let processedValue: any = answer;
    if (currentQuestion.field === 'passengerCount') {
      processedValue = Number(answer);
    } else if (currentQuestion.field === 'durationFrom' || currentQuestion.field === 'durationTo') {
      processedValue = new Date(answer);
    } else if (currentQuestion.field === 'vehicleType') {
      processedValue = answer.toLowerCase();
    }

    const newData = { ...conversationState.data, [currentQuestion.field]: processedValue };
    
    // Move to next question or complete
    const nextStep = conversationState.step + 1;
    
    if (nextStep >= INDOOR_QUESTIONS.length) {
      // All questions answered
      setConversationState({ step: nextStep, data: newData });
      completeRequest(newData);
    } else {
      // Ask next question
      setConversationState({ step: nextStep, data: newData });
      setTimeout(() => {
        addMessage('bot', INDOOR_QUESTIONS[nextStep].question);
      }, 500);
    }
  };

  const completeRequest = (data: any) => {
    setTimeout(() => {
      addMessage('bot', '✅ Great! Let me submit your request...');
      
      // Submit the request
      const requestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt'> = {
        ...data,
        source: requestType,
        requestType: 'private',
      };
      
      addRequest(requestData);
      
      setTimeout(() => {
        addMessage('bot', '✨ Your vehicle request has been submitted successfully! Our team will contact you soon.');
        addMessage('bot', 'Contact: Sh. Prasad More ji - 9960703710 or Sh. Akash More ji - 9503707518');
        setIsCompleted(true);
      }, 1000);
    }, 500);
  };

  const resetChat = () => {
    setMessages([]);
    setConversationState({ step: -1, data: {} });
    setIsCompleted(false);
    setInput('');
    startConversation();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Vehicle Request Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-4">
            {isCompleted ? (
              <Button onClick={resetChat} className="w-full">
                Start New Request
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
