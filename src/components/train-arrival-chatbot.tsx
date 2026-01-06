'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Train, X, MessageCircle } from 'lucide-react';
import { addRequest } from '@/lib/data';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

type TrainArrivalData = {
  zone?: string;
  branch?: string;
  unitNo?: string;
  officialName?: string;
  passengerName?: string;
  contactNo?: string;
  trainDetails?: string;
  departureDate?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  sevadalCount?: string;
  returnDate?: string;
  returnStation?: string;
  returnTime?: string;
};

const STEPS = [
  { key: 'zone', question: 'तुमच्या झोनचे (Zone) नाव सांगा?' },
  { key: 'branch', question: 'तुमच्या ब्रान्चचे (Branch) नाव काय आहे?' },
  { key: 'unitNo', question: 'तुमचा युनिट नंबर (Unit No.) काय आहे?' },
  { key: 'officialName', question: 'मुखी / संयोजक / सेवादल अधिकारी महोदयांचे पूर्ण नाव सांगा?' },
  { key: 'passengerName', question: 'प्रवास करणाऱ्या मुख्य महात्मांचे नाव सांगा?' },
  { key: 'contactNo', question: 'त्यांचा संपर्क क्रमांक (Mobile Number) द्या?' },
  { key: 'trainDetails', question: 'ट्रेनचे नाव आणि नंबर काय आहे?' },
  { key: 'departureDate', question: 'आपण निघण्याची तारीख काय आहे? (DD/MM/YYYY)' },
  { key: 'arrivalDate', question: 'आपण सांगली/मिरज स्टेशनवर कधी पोहोचणार? ती तारीख सांगा. (DD/MM/YYYY)' },
  { key: 'arrivalTime', question: 'स्टेशनवर पोहोचण्याची वेळ काय असेल? (उदा. 05:12 AM)' },
  { key: 'sevadalCount', question: 'आपल्या सोबत एकूण किती सेवादल सदस्य आहेत?' },
  { key: 'returnDate', question: 'तुमची परतीची तारीख (Return Date) काय आहे? (DD/MM/YYYY)' },
  { key: 'returnStation', question: 'परतीचे स्टेशन कोणते असेल? (सांगली / मिरज)' },
  { key: 'returnTime', question: 'परतीच्या ट्रेनची वेळ काय आहे?' },
];

export function TrainArrivalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState('');
  const [data, setData] = useState<TrainArrivalData>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      addBotMessage('धन निरंकार जी 🙏! सांगली समागम रेल्वे प्रवासाची माहिती नोंदवण्यासाठी कृपया खालील माहिती द्या.');
      setTimeout(() => {
        addBotMessage('भाग १: प्राथमिक माहिती (Primary Info)');
        setTimeout(() => {
          askNextQuestion();
        }, 500);
      }, 1000);
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }]);
  };

  const askNextQuestion = () => {
    if (currentStep < STEPS.length) {
      // Add section headers
      if (currentStep === 6) {
        addBotMessage('भाग २: आगमनाची माहिती (Arrival Info)');
        setTimeout(() => {
          addBotMessage(STEPS[currentStep].question);
        }, 500);
      } else if (currentStep === 11) {
        addBotMessage('भाग ३: परतीचा प्रवास (Return Info)');
        setTimeout(() => {
          addBotMessage(STEPS[currentStep].question);
        }, 500);
      } else {
        addBotMessage(STEPS[currentStep].question);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    if (isConfirming) {
      handleConfirmation(input.toLowerCase());
      return;
    }

    addUserMessage(input);

    // Save the answer
    const currentKey = STEPS[currentStep].key as keyof TrainArrivalData;
    setData(prev => ({ ...prev, [currentKey]: input }));

    setInput('');

    // Move to next step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
    } else {
      // All questions answered, show confirmation
      setTimeout(() => {
        showConfirmation();
      }, 500);
    }
  };

  const showConfirmation = () => {
    setIsConfirming(true);
    const confirmationMessage = `
तपासणी (Review Details):

झोन: ${data.zone}
ब्रान्च: ${data.branch}
युनिट नंबर: ${data.unitNo}
अधिकारी: ${data.officialName}
प्रवासी महात्मा: ${data.passengerName}
संपर्क: ${data.contactNo}

ट्रेन: ${data.trainDetails}
आगमन: ${data.arrivalDate} (${data.arrivalTime})
सेवादल संख्या: ${data.sevadalCount}

परतीचा प्रवास: ${data.returnDate} (${data.returnTime})
परतीचे स्टेशन: ${data.returnStation}

ही माहिती बरोबर आहे का? (हो / नाही)
    `.trim();

    addBotMessage(confirmationMessage);
  };

  const handleConfirmation = async (response: string) => {
    if (response === 'हो' || response === 'yes' || response === 'ho') {
      addUserMessage('हो');
      setIsSubmitting(true);
      addBotMessage('कृपया थांबा, तुमची माहिती नोंदवत आहे...');

      try {
        // Submit to Firestore
        await addRequest({
          source: 'outdoor',
          requestType: 'train',
          departmentName: data.branch || '',
          userName: data.passengerName || '',
          userPhone: data.contactNo || '',
          trainDevoteeCount: parseInt(data.sevadalCount || '0'),
          zone: data.zone,
          unitNo: data.unitNo,
          officialName: data.officialName,
          trainDetails: data.trainDetails,
          departureDate: data.departureDate,
          arrivalDate: data.arrivalDate,
          arrivalTime: data.arrivalTime,
          returnDate: data.returnDate,
          returnStation: data.returnStation,
          returnTime: data.returnTime,
        });

        addBotMessage('✅ धन्यवाद! तुमची माहिती यशस्वीरित्या नोंदवली गेली आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू. धन निरंकार जी! 🙏');
        
        // Reset after 3 seconds
        setTimeout(() => {
          resetChatbot();
        }, 3000);
      } catch (error) {
        console.error('Error submitting train arrival:', error);
        addBotMessage('❌ माफ करा, माहिती नोंदवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
        setIsSubmitting(false);
        setIsConfirming(false);
      }
    } else if (response === 'नाही' || response === 'no' || response === 'nahi') {
      addUserMessage('नाही');
      addBotMessage('ठीक आहे. कृपया पुन्हा सुरुवात करा. चॅटबॉट बंद करून पुन्हा उघडा.');
      setTimeout(() => {
        resetChatbot();
      }, 2000);
    } else {
      addBotMessage('कृपया "हो" किंवा "नाही" असे उत्तर द्या.');
    }
  };

  const resetChatbot = () => {
    setMessages([]);
    setCurrentStep(0);
    setData({});
    setIsConfirming(false);
    setIsSubmitting(false);
    setInput('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Train className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Train className="h-5 w-5" />
              <CardTitle className="text-lg">रेल्वे प्रवास नोंदणी</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetChatbot}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="तुमचे उत्तर येथे टाइप करा..."
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isSubmitting}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
