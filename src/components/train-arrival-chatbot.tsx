'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Train, X, MessageCircle } from 'lucide-react';
import { createTransportRequest } from '@dataconnect/generated';
import { getDataConnectInstance } from '@/firebase/dataconnect';

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
  selectedTrain?: string;
};

// Common trains arriving at Sangli/Miraj for the Samagam
const COMMON_TRAINS = [
  { id: '1', name: 'कोल्हापूर-पुणे इंटरसिटी', number: '11029', arrival: '05:12 AM', station: 'मिरज' },
  { id: '2', name: 'मुंबई-कोल्हापूर महालक्ष्मी एक्सप्रेस', number: '11023', arrival: '06:30 AM', station: 'सांगली' },
  { id: '3', name: 'बेंगलुरु-पुणे एक्सप्रेस', number: '16592', arrival: '08:15 AM', station: 'मिरज' },
  { id: '4', name: 'सहयाद्री एक्सप्रेस', number: '11046', arrival: '09:45 AM', station: 'सांगली' },
  { id: '5', name: 'कोल्हापूर-मुंबई जनशताब्दी', number: '12052', arrival: '12:30 PM', station: 'सांगली' },
  { id: '6', name: 'पुणे-कोल्हापूर पॅसेंजर', number: '51451', arrival: '02:15 PM', station: 'मिरज' },
  { id: '7', name: 'दिल्ली-कोल्हापूर राजधानी', number: '12218', arrival: '04:30 PM', station: 'सांगली' },
  { id: '8', name: 'Other (इतर ट्रेन)', number: 'CUSTOM', arrival: '', station: '' },
];

const STEPS = [
  { key: 'passengerName', question: 'प्रवास करणाऱ्या मुख्य महात्मांचे नाव सांगा?' },
  { key: 'contactNo', question: 'त्यांचा संपर्क क्रमांक (Mobile Number) द्या?' },
  { key: 'selectedTrain', question: 'कृपया तुमची ट्रेन निवडा:\n\n' + COMMON_TRAINS.map(t => `${t.id}️⃣ ${t.name} (${t.number})${t.arrival ? ` - ${t.arrival}` : ''}`).join('\n') + '\n\nक्रमांक टाइप करा (1-8):' },
  { key: 'arrivalDate', question: 'आपण सांगली/मिरज स्टेशनवर कधी पोहोचणार? ती तारीख सांगा. (DD/MM/YYYY)' },
  { key: 'sevadalCount', question: 'आपल्या सोबत एकूण किती सेवादल सदस्य आहेत?' },
  { key: 'returnDate', question: 'तुमची परतीची तारीख (Return Date) काय आहे? (DD/MM/YYYY)' },
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
        if (currentStep < STEPS.length) {
          addBotMessage(STEPS[currentStep].question);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      addBotMessage(STEPS[currentStep].question);
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
    const currentKey = STEPS[currentStep].key as keyof TrainArrivalData;

    // Special handling for train selection
    if (currentKey === 'selectedTrain') {
      const trainIndex = parseInt(input.trim()) - 1;
      if (trainIndex >= 0 && trainIndex < COMMON_TRAINS.length) {
        const selectedTrain = COMMON_TRAINS[trainIndex];
        
        if (selectedTrain.number === 'CUSTOM') {
          // User selected "Other" - need to ask for custom train details
          setData(prev => ({ ...prev, selectedTrain: 'CUSTOM' }));
          setInput('');
          addBotMessage('कृपया ट्रेनचे पूर्ण नाव आणि नंबर टाइप करा (उदा: पुणे एक्सप्रेस 12345):');
          return; // Don't move to next step yet
        } else {
          // Auto-fill train details
          setData(prev => ({ 
            ...prev, 
            selectedTrain: input,
            trainDetails: `${selectedTrain.name} (${selectedTrain.number})`,
            arrivalTime: selectedTrain.arrival,
            returnStation: selectedTrain.station,
          }));
          addBotMessage(`✅ निवडलेली ट्रेन: ${selectedTrain.name} (${selectedTrain.number})\n📍 स्टेशन: ${selectedTrain.station}\n🕐 आगमन वेळ: ${selectedTrain.arrival}`);
        }
      } else {
        addBotMessage('❌ कृपया 1 ते 8 मधील वैध क्रमांक टाइप करा.');
        setInput('');
        return;
      }
    } else if (data.selectedTrain === 'CUSTOM' && !data.trainDetails) {
      // Handle custom train details input
      if (input.trim().length < 5) {
        addBotMessage('❌ कृपया ट्रेनचे पूर्ण नाव आणि नंबर द्या.');
        setInput('');
        return;
      }
      setData(prev => ({ 
        ...prev, 
        trainDetails: input,
        arrivalTime: 'तुम्ही सांगाल',
        returnStation: 'सांगली/मिरज',
      }));
      addBotMessage(`✅ ट्रेन नोंदवली: ${input}`);
      setInput('');
      // Now move to next step
      setCurrentStep(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
      return;
    } else if (currentKey === 'contactNo') {
      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(input.trim())) {
        addBotMessage('❌ कृपया वैध 10 अंकी मोबाईल नंबर द्या (6, 7, 8, किंवा 9 ने सुरू होणारा).');
        setInput('');
        return;
      }
      setData(prev => ({ ...prev, [currentKey]: input }));
    } else if (currentKey === 'arrivalDate' || currentKey === 'returnDate') {
      // Validate date format DD/MM/YYYY
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(input.trim())) {
        addBotMessage('❌ कृपया तारीख DD/MM/YYYY या स्वरूपात द्या (उदा: 15/01/2026).');
        setInput('');
        return;
      }
      setData(prev => ({ ...prev, [currentKey]: input }));
    } else if (currentKey === 'sevadalCount') {
      // Validate passenger count
      const count = parseInt(input.trim());
      if (isNaN(count) || count < 1 || count > 100) {
        addBotMessage('❌ कृपया 1 ते 100 मधील वैध संख्या द्या.');
        setInput('');
        return;
      }
      setData(prev => ({ ...prev, [currentKey]: input }));
    } else {
      // Save the answer normally
      setData(prev => ({ ...prev, [currentKey]: input }));
    }

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

प्रवासी महात्मा: ${data.passengerName}
संपर्क: ${data.contactNo}

ट्रेन: ${data.trainDetails}
आगमन तारीख: ${data.arrivalDate}
आगमन वेळ: ${data.arrivalTime}
स्टेशन: ${data.returnStation}
सेवादल संख्या: ${data.sevadalCount}

परतीची तारीख: ${data.returnDate}

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
        // Validate required data before submission
        if (!data.passengerName || !data.contactNo) {
          addBotMessage('❌ त्रुटी: नाव आणि संपर्क क्रमांक आवश्यक आहे.');
          setIsSubmitting(false);
          setIsConfirming(false);
          return;
        }

        // Parse date correctly (DD/MM/YYYY format)
        const dateParts = data.arrivalDate?.split('/') || [];
        let scheduledDate: Date;
        
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
          const year = parseInt(dateParts[2]);
          scheduledDate = new Date(year, month, day);
          
          // Validate date
          if (isNaN(scheduledDate.getTime())) {
            addBotMessage('❌ त्रुटी: अवैध आगमन तारीख. कृपया पुन्हा प्रयत्न करा.');
            setIsSubmitting(false);
            setIsConfirming(false);
            return;
          }
        } else {
          addBotMessage('❌ त्रुटी: आगमन तारीख योग्य स्वरूपात नाही. कृपया पुन्हा प्रयत्न करा.');
          setIsSubmitting(false);
          setIsConfirming(false);
          return;
        }

        console.log('📤 Submitting train arrival request:', {
          passengerName: data.passengerName,
          contactNo: data.contactNo,
          trainDetails: data.trainDetails,
          scheduledDate: scheduledDate.toISOString(),
        });

        // Get Data Connect instance
        const dcInstance = getDataConnectInstance();
        if (!dcInstance) {
          throw new Error('Data Connect not initialized. Please refresh the page.');
        }

        // Submit to Data Connect with explicit instance
        const result = await createTransportRequest(dcInstance, {
          passengerName: data.passengerName,
          department: 'Train Arrival',
          purpose: 'Train arrival - Sant Samagam',
          phoneNumber: data.contactNo,
          employeeId: '',
          pickupLocation: `${data.returnStation || 'Station'} - ${data.trainDetails || 'Train'}`,
          dropLocation: 'Samagam Grounds',
          scheduledTime: scheduledDate.toISOString(),
          priority: 'normal',
          numberOfPassengers: parseInt(data.sevadalCount || '1'),
          requestType: 'outdoor',
          specialRequirements: `Train: ${data.trainDetails}, Arrival: ${data.arrivalDate} at ${data.arrivalTime}, Return: ${data.returnDate}`,
        });

        console.log('✅ Request submitted successfully:', result);
        addBotMessage('✅ धन्यवाद! तुमची माहिती यशस्वीरित्या नोंदवली गेली आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू. धन निरंकार जी! 🙏');
        
        // Reset after 3 seconds
        setTimeout(() => {
          resetChatbot();
        }, 3000);
      } catch (error: any) {
        console.error('❌ Error submitting train arrival:', error);
        console.error('Error details:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
          fullError: error,
        });
        
        let errorMessage = '❌ माफ करा, माहिती नोंदवताना त्रुटी आली.\n\n';
        
        if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.message?.includes('Failed to')) {
          errorMessage += '⚠️ सर्व्हर उपलब्ध नाही.\n\n';
          errorMessage += 'डेव्हलपर्ससाठी:\n';
          errorMessage += '• Firebase Data Connect emulator चालू आहे का ते तपासा\n';
          errorMessage += '• Firebase config योग्य आहे का ते तपासा\n';
          errorMessage += '• Browser console मध्ये अधिक तपशील पहा';
        } else if (error?.message) {
          errorMessage += `त्रुटी: ${error.message}\n\nकृपया browser console तपासा.`;
        } else {
          errorMessage += 'अज्ञात त्रुटी. Browser console तपासा.';
        }
        
        addBotMessage(errorMessage);
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
