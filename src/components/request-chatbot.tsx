'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Languages } from 'lucide-react';
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
type Language = 'english' | 'hindi' | 'marathi';

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

const TRANSLATIONS = {
  english: {
    greeting: 'Dhan Nirankar Ji, you are welcome to 59th Nirankari Sant Samagam transport sewa! 🙏',
    helpMessage: "I'm here to help you request a {type} vehicle. Let's get started!",
    languageSelect: 'Please select your preferred language / कृपया अपनी भाषा चुनें / कृपया तुमची भाषा निवडा',
    questions: [
      { field: 'userName', question: 'What is your name?', invalidMsg: "Sorry, that doesn't seem valid. What is your name?" },
      { field: 'contactNumber', question: 'What is your contact number?', invalidMsg: "Sorry, that doesn't seem valid. What is your contact number?" },
      { field: 'departmentName', question: 'What is your department name?', invalidMsg: "Sorry, that doesn't seem valid. What is your department name?" },
      { field: 'vehicleType', question: 'What type of vehicle do you need? (Options: two-wheeler, four-wheeler, tempo, eicher, bus)', invalidMsg: 'Please choose from: two-wheeler, four-wheeler, tempo, eicher, bus' },
      { field: 'destination', question: 'What is your destination?', invalidMsg: "Sorry, that doesn't seem valid. What is your destination?" },
      { field: 'passengerCount', question: 'How many passengers?', invalidMsg: 'Please enter a valid number of passengers.' },
      { field: 'durationFrom', question: 'Start date? (Format: YYYY-MM-DD)', invalidMsg: 'Please enter a valid date in YYYY-MM-DD format.' },
      { field: 'durationTo', question: 'End date? (Format: YYYY-MM-DD)', invalidMsg: 'Please enter a valid date in YYYY-MM-DD format.' },
    ],
    submitting: '✅ Great! Let me submit your request...',
    success: '✨ Your vehicle request has been submitted successfully! Our team will contact you soon.',
    contact: 'Contact: Sh. Prasad More ji - 9960703710 or Sh. Akash More ji - 9503707518',
    newRequest: 'Start New Request',
    placeholder: 'Type your answer...',
    title: 'Vehicle Request Assistant',
  },
  hindi: {
    greeting: 'धन निरंकार जी, 59वें निरंकारी संत समागम परिवहन सेवा में आपका स्वागत है! 🙏',
    helpMessage: 'मैं आपको {type} वाहन अनुरोध करने में मदद करने के लिए यहाँ हूँ। चलिए शुरू करते हैं!',
    languageSelect: 'कृपया अपनी भाषा चुनें / Please select your language / कृपया तुमची भाषा निवडा',
    questions: [
      { field: 'userName', question: 'आपका नाम क्या है?', invalidMsg: 'क्षमा करें, यह सही नहीं लग रहा। आपका नाम क्या है?' },
      { field: 'contactNumber', question: 'आपका संपर्क नंबर क्या है?', invalidMsg: 'क्षमा करें, यह सही नहीं लग रहा। आपका संपर्क नंबर क्या है?' },
      { field: 'departmentName', question: 'आपके विभाग का नाम क्या है?', invalidMsg: 'क्षमा करें, यह सही नहीं लग रहा। आपके विभाग का नाम क्या है?' },
      { field: 'vehicleType', question: 'आपको किस प्रकार का वाहन चाहिए? (विकल्प: two-wheeler, four-wheeler, tempo, eicher, bus)', invalidMsg: 'कृपया इनमें से चुनें: two-wheeler, four-wheeler, tempo, eicher, bus' },
      { field: 'destination', question: 'आपकी मंजिल क्या है?', invalidMsg: 'क्षमा करें, यह सही नहीं लग रहा। आपकी मंजिल क्या है?' },
      { field: 'passengerCount', question: 'कितने यात्री हैं?', invalidMsg: 'कृपया यात्रियों की वैध संख्या दर्ज करें।' },
      { field: 'durationFrom', question: 'शुरुआत की तारीख? (प्रारूप: YYYY-MM-DD)', invalidMsg: 'कृपया YYYY-MM-DD प्रारूप में वैध तारीख दर्ज करें।' },
      { field: 'durationTo', question: 'समाप्ति की तारीख? (प्रारूप: YYYY-MM-DD)', invalidMsg: 'कृपया YYYY-MM-DD प्रारूप में वैध तारीख दर्ज करें।' },
    ],
    submitting: '✅ बढ़िया! मैं आपका अनुरोध जमा कर रहा हूँ...',
    success: '✨ आपका वाहन अनुरोध सफलतापूर्वक जमा हो गया है! हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    contact: 'संपर्क: श्री प्रसाद मोरे जी - 9960703710 या श्री आकाश मोरे जी - 9503707518',
    newRequest: 'नया अनुरोध शुरू करें',
    placeholder: 'अपना उत्तर टाइप करें...',
    title: 'वाहन अनुरोध सहायक',
  },
  marathi: {
    greeting: 'धन निरंकार जी, ५९व्या निरंकारी संत समागम वाहतूक सेवेत तुमचे स्वागत आहे! 🙏',
    helpMessage: 'मी तुम्हाला {type} वाहन विनंती करण्यात मदत करण्यासाठी येथे आहे. चला सुरुवात करूया!',
    languageSelect: 'कृपया तुमची भाषा निवडा / Please select your language / कृपया अपनी भाषा चुनें',
    questions: [
      { field: 'userName', question: 'तुमचे नाव काय आहे?', invalidMsg: 'माफ करा, ते योग्य वाटत नाही. तुमचे नाव काय आहे?' },
      { field: 'contactNumber', question: 'तुमचा संपर्क नंबर काय आहे?', invalidMsg: 'माफ करा, ते योग्य वाटत नाही. तुमचा संपर्क नंबर काय आहे?' },
      { field: 'departmentName', question: 'तुमच्या विभागाचे नाव काय आहे?', invalidMsg: 'माफ करा, ते योग्य वाटत नाही. तुमच्या विभागाचे नाव काय आहे?' },
      { field: 'vehicleType', question: 'तुम्हाला कोणत्या प्रकारचे वाहन हवे आहे? (पर्याय: two-wheeler, four-wheeler, tempo, eicher, bus)', invalidMsg: 'कृपया यापैकी निवडा: two-wheeler, four-wheeler, tempo, eicher, bus' },
      { field: 'destination', question: 'तुमचे गंतव्य काय आहे?', invalidMsg: 'माफ करा, ते योग्य वाटत नाही. तुमचे गंतव्य काय आहे?' },
      { field: 'passengerCount', question: 'किती प्रवासी आहेत?', invalidMsg: 'कृपया प्रवाशांची वैध संख्या प्रविष्ट करा.' },
      { field: 'durationFrom', question: 'सुरुवातीची तारीख? (स्वरूप: YYYY-MM-DD)', invalidMsg: 'कृपया YYYY-MM-DD स्वरूपात वैध तारीख प्रविष्ट करा.' },
      { field: 'durationTo', question: 'समाप्तीची तारीख? (स्वरूप: YYYY-MM-DD)', invalidMsg: 'कृपया YYYY-MM-DD स्वरूपात वैध तारीख प्रविष्ट करा.' },
    ],
    submitting: '✅ छान! मी तुमची विनंती सबमिट करत आहे...',
    success: '✨ तुमची वाहन विनंती यशस्वीरित्या सबमिट झाली आहे! आमची टीम लवकरच तुमच्याशी संपर्क साधेल.',
    contact: 'संपर्क: श्री प्रसाद मोरे जी - 9960703710 किंवा श्री आकाश मोरे जी - 9503707518',
    newRequest: 'नवीन विनंती सुरू करा',
    placeholder: 'तुमचे उत्तर टाइप करा...',
    title: 'वाहन विनंती सहाय्यक',
  },
};

const VALIDATION_RULES = [
  { field: 'userName', validate: (val: string) => val.length >= 2 },
  { field: 'contactNumber', validate: (val: string) => val.length >= 10 },
  { field: 'departmentName', validate: (val: string) => val.length >= 2 },
  { field: 'vehicleType', validate: (val: string) => ['two-wheeler', 'four-wheeler', 'tempo', 'eicher', 'bus'].includes(val.toLowerCase()) },
  { field: 'destination', validate: (val: string) => val.length >= 1 },
  { field: 'passengerCount', validate: (val: string) => !isNaN(Number(val)) && Number(val) >= 1 },
  { field: 'durationFrom', validate: (val: string) => !isNaN(Date.parse(val)) },
  { field: 'durationTo', validate: (val: string) => !isNaN(Date.parse(val)) },
];

export function RequestChatbot({ requestType = 'indoor' }: { requestType?: RequestType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: -1,
    data: {},
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [reminderShown, setReminderShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageCounterRef = useRef<number>(0);

  const INACTIVITY_WARNING = 3 * 60 * 1000; // 3 minutes in milliseconds
  const INACTIVITY_CLOSE = 4 * 60 * 1000; // 4 minutes total (1 minute after warning)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && conversationState.step === -1 && !language) {
      askLanguagePreference();
    }
  }, [isOpen]);

  // Inactivity timeout effect
  useEffect(() => {
    if (!isOpen || isCompleted) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
      return;
    }

    // Check for inactivity every 30 seconds
    inactivityTimerRef.current = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivityTime;

      if (inactiveTime >= INACTIVITY_CLOSE) {
        // Close chat after 4 minutes of total inactivity
        const closeMsg = language 
          ? (language === 'hindi' ? 'चैट निष्क्रियता के कारण बंद हो रही है।' 
             : language === 'marathi' ? 'चॅट निष्क्रियतेमुळे बंद होत आहे।'
             : 'Chat closing due to inactivity.')
          : 'Chat closing due to inactivity.';
        
        addMessage('bot', closeMsg);
        setTimeout(() => {
          setIsOpen(false);
          resetChat();
        }, 2000);
      } else if (inactiveTime >= INACTIVITY_WARNING && !reminderShown) {
        // Show reminder after 3 minutes
        const reminderMsg = language
          ? (language === 'hindi' ? '⏰ क्या आप अभी भी यहाँ हैं? कृपया जारी रखने के लिए जवाब दें या चैट 1 मिनट में बंद हो जाएगी।'
             : language === 'marathi' ? '⏰ तुम्ही अजूनही येथे आहात का? कृपया सुरू ठेवण्यासाठी उत्तर द्या किंवा चॅट 1 मिनिटात बंद होईल.'
             : '⏰ Are you still there? Please respond to continue or the chat will close in 1 minute.')
          : '⏰ Are you still there? Please respond to continue or the chat will close in 1 minute.';
        
        addMessage('bot', reminderMsg);
        setReminderShown(true);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [isOpen, lastActivityTime, reminderShown, isCompleted, language]);

  const resetActivityTimer = () => {
    setLastActivityTime(Date.now());
    setReminderShown(false);
  };

  const addMessage = (role: 'bot' | 'user', content: string) => {
    messageCounterRef.current += 1;
    const newMessage: Message = {
      id: `${Date.now()}-${messageCounterRef.current}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const askLanguagePreference = () => {
    addMessage('bot', TRANSLATIONS.english.languageSelect);
    addMessage('bot', 'Type: 1 for English / 2 for हिंदी / 3 for मराठी');
  };

  const startConversation = (selectedLang: Language) => {
    const trans = TRANSLATIONS[selectedLang];
    addMessage('bot', trans.greeting);
    setTimeout(() => {
      addMessage('bot', trans.helpMessage.replace('{type}', requestType));
    }, 800);
    setTimeout(() => {
      addMessage('bot', trans.questions[0].question);
      setConversationState({ step: 0, data: {} });
    }, 1600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isCompleted) return;

    const userInput = input.trim();
    addMessage('user', userInput);
    setInput('');
    resetActivityTimer(); // Reset timer on user activity

    // Handle language selection first
    if (!language) {
      handleLanguageSelection(userInput);
      return;
    }

    // Process the answer
    processAnswer(userInput);
  };

  const handleLanguageSelection = (input: string) => {
    let selectedLang: Language | null = null;
    const choice = input.trim();
    
    if (choice === '1' || choice.toLowerCase() === 'english') {
      selectedLang = 'english';
    } else if (choice === '2' || choice.toLowerCase() === 'hindi' || choice.toLowerCase() === 'हिंदी') {
      selectedLang = 'hindi';
    } else if (choice === '3' || choice.toLowerCase() === 'marathi' || choice.toLowerCase() === 'मराठी') {
      selectedLang = 'marathi';
    }

    if (selectedLang) {
      setLanguage(selectedLang);
      setTimeout(() => {
        startConversation(selectedLang);
      }, 500);
    } else {
      setTimeout(() => {
        addMessage('bot', 'Please select a valid option: 1, 2, or 3');
      }, 500);
    }
  };

  const processAnswer = (answer: string) => {
    if (!language) return;
    
    const trans = TRANSLATIONS[language];
    const currentValidation = VALIDATION_RULES[conversationState.step];
    const currentQuestion = trans.questions[conversationState.step];
    
    // Validate the answer
    if (!currentValidation.validate(answer)) {
      setTimeout(() => {
        addMessage('bot', currentQuestion.invalidMsg);
      }, 500);
      return;
    }

    // Store the answer
    let processedValue: any = answer;
    if (currentValidation.field === 'passengerCount') {
      processedValue = Number(answer);
    } else if (currentValidation.field === 'durationFrom' || currentValidation.field === 'durationTo') {
      processedValue = new Date(answer);
    } else if (currentValidation.field === 'vehicleType') {
      processedValue = answer.toLowerCase();
    }

    const newData = { ...conversationState.data, [currentValidation.field]: processedValue };
    
    // Move to next question or complete
    const nextStep = conversationState.step + 1;
    
    if (nextStep >= VALIDATION_RULES.length) {
      // All questions answered
      setConversationState({ step: nextStep, data: newData });
      completeRequest(newData);
    } else {
      // Ask next question
      setConversationState({ step: nextStep, data: newData });
      setTimeout(() => {
        addMessage('bot', trans.questions[nextStep].question);
      }, 500);
    }
  };

  const completeRequest = (data: any) => {
    if (!language) return;
    
    const trans = TRANSLATIONS[language];
    
    setTimeout(() => {
      addMessage('bot', trans.submitting);
      
      // Submit the request
      const requestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt'> = {
        ...data,
        source: requestType,
        requestType: 'private',
      };
      
      addRequest(requestData);
      
      setTimeout(() => {
        addMessage('bot', trans.success);
        addMessage('bot', trans.contact);
        setIsCompleted(true);
      }, 1000);
    }, 500);
  };

  const resetChat = () => {
    setMessages([]);
    setConversationState({ step: -1, data: {} });
    setIsCompleted(false);
    setInput('');
    setLanguage(null);
    setReminderShown(false);
    resetActivityTimer();
    if (isOpen) {
      askLanguagePreference();
    }
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
              <CardTitle className="text-lg">
                {language ? TRANSLATIONS[language].title : 'Vehicle Request Assistant'}
              </CardTitle>
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
                {language ? TRANSLATIONS[language].newRequest : 'Start New Request'}
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language ? TRANSLATIONS[language].placeholder : 'Type your answer...'}
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
