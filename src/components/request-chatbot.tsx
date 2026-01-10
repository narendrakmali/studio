'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createTransportRequest } from '@dataconnect/generated';
import { getDataConnectInstance } from '@/firebase/dataconnect';

type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
};

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
  }>;
};

const TRANSLATIONS = {
  english: {
    greeting: 'Dhan Nirankar Ji, you are welcome to 59th Nirankari Sant Samagam transport sewa! 🙏',
    helpMessage: "I'm here to help you request a vehicle. Let's get started!",
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
    helpMessage: 'मैं आपको वाहन अनुरोध करने में मदद करने के लिए यहाँ हूँ। चलिए शुरू करते हैं!',
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
    helpMessage: 'मी तुम्हाला वाहन विनंती करण्यात मदत करण्यासाठी येथे आहे. चला सुरुवात करूया!',
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
  { field: 'vehicleType', validate: (val: string) => ['two-wheeler', 'four-wheeler', 'tempo', 'eicher', 'bus', 'car', 'suv', 'winger', 'innova'].includes(val.toLowerCase()) },
  { field: 'destination', validate: (val: string) => val.length >= 1 },
  { field: 'passengerCount', validate: (val: string) => !isNaN(Number(val)) && Number(val) >= 1 },
  { field: 'durationFrom', validate: (val: string) => !isNaN(Date.parse(val)) },
  { field: 'durationTo', validate: (val: string) => !isNaN(Date.parse(val)) },
  { field: 'registrationNumber', validate: (val: string) => val.length >= 1 },
  { field: 'driverName', validate: (val: string) => val.length >= 1 },
  { field: 'driverContact', validate: (val: string) => val.length >= 10 },
];

// Helper to get questions based on request type
function getQuestions(lang: Language) {
  const trans = TRANSLATIONS[lang];
  return [
    trans.questions[0], // userName
    trans.questions[1], // contactNumber
    trans.questions[2], // departmentName
    {
      field: 'vehicleType',
      question: lang === 'english' ? 'What type of vehicle? (Options: two-wheeler, car, suv, winger, innova)'
        : lang === 'hindi' ? 'किस प्रकार का वाहन? (विकल्प: two-wheeler, car, suv, winger, innova)'
        : 'कोणत्या प्रकारचे वाहन? (पर्याय: two-wheeler, car, suv, winger, innova)',
      invalidMsg: lang === 'english' ? 'Please choose from: two-wheeler, car, suv, winger, innova'
        : lang === 'hindi' ? 'कृपया इनमें से चुनें: two-wheeler, car, suv, winger, innova'
        : 'कृपया यापैकी निवडा: two-wheeler, car, suv, winger, innova'
    },
    {
      field: 'registrationNumber',
      question: lang === 'english' ? 'Vehicle registration number?'
        : lang === 'hindi' ? 'वाहन पंजीकरण संख्या?'
        : 'वाहन नोंदणी क्रमांक?',
      invalidMsg: lang === 'english' ? 'Please enter a valid registration number.'
        : lang === 'hindi' ? 'कृपया वैध पंजीकरण संख्या दर्ज करें।'
        : 'कृपया वैध नोंदणी क्रमांक प्रविष्ट करा.'
    },
    trans.questions[5], // passengerCount
    {
      field: 'driverName',
      question: lang === 'english' ? 'Driver name?'
        : lang === 'hindi' ? 'ड्राइवर का नाम?'
        : 'चालकाचे नाव?',
      invalidMsg: lang === 'english' ? 'Please enter driver name.'
        : lang === 'hindi' ? 'कृपया ड्राइवर का नाम दर्ज करें।'
        : 'कृपया चालकाचे नाव प्रविष्ट करा.'
    },
    {
      field: 'driverContact',
      question: lang === 'english' ? 'Driver contact number?'
        : lang === 'hindi' ? 'ड्राइवर का संपर्क नंबर?'
        : 'चालकाचा संपर्क क्रमांक?',
      invalidMsg: lang === 'english' ? 'Please enter a valid contact number.'
        : lang === 'hindi' ? 'कृपया वैध संपर्क नंबर दर्ज करें।'
        : 'कृपया वैध संपर्क क्रमांक प्रविष्ट करा.'
    },
    trans.questions[6], // durationFrom
    trans.questions[7], // durationTo
  ];
}

export function RequestChatbot({ autoPopup = false }: { autoPopup?: boolean }) {
  const [isOpen, setIsOpen] = useState(autoPopup);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language | null>(autoPopup ? 'marathi' : null);
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
    if (isOpen && conversationState.step === -1) {
      if (autoPopup && language === 'marathi') {
        // Auto-popup with Marathi greeting
        setTimeout(() => {
          addMessage('bot', 'धन निरंकार जी, मी तुमची कशी मदत करू शकतो? 🙏');
          setTimeout(() => {
            startConversation('marathi');
          }, 1000);
        }, 500);
      } else if (!language) {
        askLanguagePreference();
      }
    }
  }, [isOpen, autoPopup]);

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
      id: `${Date.now()}-${messageCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const askLanguagePreference = () => {
    addMessage('bot', 'Dhan Nirankar Ji, you are welcome to 59th Nirankari Sant Samagam transport sewa! 🙏');
    setTimeout(() => {
      addMessage('bot', TRANSLATIONS.english.languageSelect);
    }, 800);
    setTimeout(() => {
      addMessage('bot', 'Type: 1 for English / 2 for हिंदी / 3 for मराठी');
    }, 1200);
  };

  const startConversation = (selectedLang: Language) => {
    const trans = TRANSLATIONS[selectedLang];
    const questions = getQuestions(selectedLang);
    addMessage('bot', trans.helpMessage);
    setTimeout(() => {
      addMessage('bot', questions[0].question);
      setConversationState({ step: 0, data: {} });
    }, 800);
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
    const questions = getQuestions(language);
    const currentQuestion = questions[conversationState.step];
    
    // Find the validation rule for this field
    const currentValidation = VALIDATION_RULES.find(rule => rule.field === currentQuestion.field);
    
    if (!currentValidation) {
      console.error('No validation rule found for field:', currentQuestion.field);
      return;
    }
    
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
    
    if (nextStep >= questions.length) {
      // All questions answered
      setConversationState({ step: nextStep, data: newData });
      completeRequest(newData);
    } else {
      // Ask next question
      setConversationState({ step: nextStep, data: newData });
      setTimeout(() => {
        addMessage('bot', questions[nextStep].question);
      }, 500);
    }
  };

  const completeRequest = async (data: any) => {
    if (!language) return;
    
    const trans = TRANSLATIONS[language];
    
    setTimeout(async () => {
      addMessage('bot', trans.submitting);
      
      try {
        // Get Data Connect instance
        const dcInstance = getDataConnectInstance();
        if (!dcInstance) {
          throw new Error('Data Connect not initialized. Please refresh the page.');
        }

        // Submit the request using Data Connect
        const result = await createTransportRequest(dcInstance, {
          passengerName: data.userName || '',
          department: data.departmentName || '',
          purpose: 'Vehicle request via chatbot',
          phoneNumber: data.contactNumber || '',
          employeeId: '',
          pickupLocation: data.destination || 'Not specified',
          dropLocation: 'Samagam Grounds',
          scheduledTime: (data.durationFrom || new Date()).toISOString(),
          priority: 'normal',
          numberOfPassengers: data.passengerCount || 1,
          requestType: 'outdoor',
          specialRequirements: `Vehicle Type: ${data.vehicleType || 'Not specified'}. Duration: ${data.durationFrom?.toLocaleDateString()} to ${data.durationTo?.toLocaleDateString()}`,
        });
        
        console.log('✅ Chatbot request successfully saved:', result.data.transportRequest_insert);
        
        setTimeout(() => {
          addMessage('bot', trans.success);
          addMessage('bot', trans.contact);
          setIsCompleted(true);
        }, 1000);
      } catch (error) {
        console.error('❌ Chatbot failed to save request:', error);
        setTimeout(() => {
          addMessage('bot', language === 'english' 
            ? '❌ Failed to submit request. Please try again or contact support.'
            : language === 'hindi'
            ? '❌ अनुरोध जमा करने में विफल। कृपया पुनः प्रयास करें या समर्थन से संपर्क करें।'
            : '❌ विनंती सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा किंवा समर्थनाशी संपर्क साधा.');
        }, 1000);
      }
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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-96 h-[100dvh] sm:h-[600px] flex flex-col shadow-2xl z-50 sm:rounded-lg rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 border-b px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">
                {language ? TRANSLATIONS[language].title : 'Vehicle Request Assistant'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && (
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 sm:px-4 sm:py-2 max-w-[85%] sm:max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-3 sm:p-4">
            {isCompleted ? (
              <Button onClick={resetChat} className="w-full text-sm sm:text-base">
                {language ? TRANSLATIONS[language].newRequest : 'Start New Request'}
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language ? TRANSLATIONS[language].placeholder : 'Type your answer...'}
                  className="flex-1 text-sm sm:text-base"
                  autoFocus
                />
                <Button type="submit" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </form>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
