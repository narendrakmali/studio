'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Upload } from 'lucide-react';
import { createTransportRequest } from '@dataconnect/generated';
import { getDataConnectInstance } from '@/firebase/dataconnect';
import { Input } from '@/components/ui/input';

type ServiceType = 
  | 'menu'
  | 'private-vehicle'
  | 'private-bus'
  | 'msrtc-bus'
  | 'train'
  | 'flight';

type Message = {
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isMenu?: boolean;
};

export function UnifiedTransportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentService, setCurrentService] = useState<ServiceType>('menu');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      showMainMenu();
    }
  }, [isOpen]);

  const addMessage = (content: string, role: 'bot' | 'user', isMenu = false) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date(), isMenu }]);
  };

  const showMainMenu = () => {
    setCurrentService('menu');
    setCurrentStep(0);
    setFormData({});
    setUploadedFile(null);
    
    const menuMessage = `🙏 Welcome to Transport Coordination Portal

Please select a service:

1️⃣ Private Vehicle Request
2️⃣ Private Bus Request
3️⃣ MSRTC Bus (with booking receipt)
4️⃣ Train Arrival/Departure
5️⃣ Flight Arrival/Departure

Reply with the number (1-5) of your choice.`;

    addMessage(menuMessage, 'bot', true);
  };

  const handleServiceSelection = (choice: string) => {
    const num = parseInt(choice.trim());
    
    switch (num) {
      case 1:
        setCurrentService('private-vehicle');
        addMessage('Private Vehicle Request', 'user');
        addMessage('Please provide your name:', 'bot');
        setCurrentStep(1);
        break;
      case 2:
        setCurrentService('private-bus');
        addMessage('Private Bus Request', 'user');
        addMessage('Please provide the group/organization name:', 'bot');
        setCurrentStep(1);
        break;
      case 3:
        setCurrentService('msrtc-bus');
        addMessage('MSRTC Bus Request', 'user');
        addMessage('Please upload your MSRTC booking receipt first:', 'bot');
        setCurrentStep(1);
        break;
      case 4:
        setCurrentService('train');
        addMessage('Train Arrival/Departure', 'user');
        addMessage('Please provide your name:', 'bot');
        setCurrentStep(1);
        break;
      case 5:
        setCurrentService('flight');
        addMessage('Flight Arrival/Departure', 'user');
        addMessage('Please provide your name:', 'bot');
        setCurrentStep(1);
        break;
      default:
        addMessage('Invalid choice. Please reply with a number from 1 to 5.', 'bot');
    }
  };

  const getNextQuestion = (service: ServiceType, step: number): string | null => {
    const questions: Record<ServiceType, string[]> = {
      'menu': [],
      'private-vehicle': [
        'Please provide your name:',
        'Your phone number:',
        'Pickup location:',
        'Drop location:',
        'Day in January 2026 (e.g., 15 for Jan 15):',
        'Number of passengers:',
        'Any special requirements?'
      ],
      'private-bus': [
        'Please provide the group/organization name:',
        'Contact person name:',
        'Contact phone number:',
        'Pickup location:',
        'Drop location:',
        'Day in January 2026 (e.g., 15 for Jan 15):',
        'Number of passengers:',
        'Any special requirements?'
      ],
      'msrtc-bus': [
        'Please upload your MSRTC booking receipt first:',
        'Your name:',
        'Contact phone number:',
        'Bus number from receipt:',
        'Arrival day in January 2026 (e.g., 15 for Jan 15):',
        'Pickup point for transport to Samagam grounds:',
        'Number of passengers:',
        'Any special requirements?'
      ],
      'train': [
        'Please provide your name:',
        'Your phone number:',
        'Train name and number:',
        'Arrival or Departure? (A/D):',
        'Station name:',
        'Day in January 2026 (e.g., 15 for Jan 15):',
        'Number of passengers:',
        'Pickup/Drop location at Samagam:'
      ],
      'flight': [
        'Please provide your name:',
        'Your phone number:',
        'Flight number:',
        'Airline name:',
        'Arrival or Departure? (A/D):',
        'Airport name:',
        'Day in January 2026 (e.g., 15 for Jan 15):',
        'Number of passengers:',
        'Pickup/Drop location at Samagam:'
      ]
    };

    const serviceQuestions = questions[service];
    return step < serviceQuestions.length ? serviceQuestions[step] : null;
  };

  const handleFormSubmit = async () => {
    try {
      // Convert day number to full date in January 2026
      const day = parseInt(formData.day || '7');
      const scheduledTime = new Date(2026, 0, day).toISOString(); // Month 0 = January

      let purpose = '';
      let specialRequirements = formData.specialRequirements || '';

      switch (currentService) {
        case 'private-vehicle':
          purpose = 'Private Vehicle Request';
          break;
        case 'private-bus':
          purpose = `Private Bus for ${formData.groupName}`;
          specialRequirements = `Contact: ${formData.contactPerson}. ${specialRequirements}`;
          break;
        case 'msrtc-bus':
          purpose = `MSRTC Bus ${formData.busNumber}`;
          specialRequirements = `Receipt uploaded. ${specialRequirements}`;
          break;
        case 'train':
          purpose = `Train ${formData.trainNumber} - ${formData.arrivalDeparture === 'A' ? 'Arrival' : 'Departure'}`;
          specialRequirements = `Station: ${formData.station}. ${specialRequirements}`;
          break;
        case 'flight':
          purpose = `${formData.airline} Flight ${formData.flightNumber} - ${formData.arrivalDeparture === 'A' ? 'Arrival' : 'Departure'}`;
          specialRequirements = `Airport: ${formData.airport}. ${specialRequirements}`;
          break;
      }

      const dcInstance = getDataConnectInstance();
      if (!dcInstance) {
        throw new Error('Data Connect not initialized. Please refresh the page.');
      }

      await createTransportRequest(dcInstance, {
        passengerName: formData.name || formData.groupName || 'Unknown',
        department: 'Chatbot Request',
        purpose,
        phoneNumber: formData.phone || '',
        employeeId: '',
        pickupLocation: formData.pickupLocation || formData.station || formData.airport || 'TBD',
        dropLocation: formData.dropLocation || formData.samagamLocation || 'Samagam Grounds',
        scheduledTime,
        priority: 'normal',
        specialRequirements: `Date: Jan ${day}, 2026. ${specialRequirements}`,
        numberOfPassengers: parseInt(formData.passengers || '1'),
        requestType: 'outdoor',
      });

      addMessage('✅ Your request has been submitted successfully! Our team will contact you shortly.', 'bot');
      
      setTimeout(() => {
        addMessage('Would you like to make another request? (Type "yes" or "no")', 'bot');
      }, 1000);
      
      setCurrentStep(-1);
    } catch (error) {
      addMessage('❌ Failed to submit request. Please try again or contact support.', 'bot');
      console.error('Submission error:', error);
    }
  };

  const handleUserInput = async (userInput: string) => {
    if (!userInput.trim()) return;

    addMessage(userInput, 'user');
    setInput('');

    // Check for restart
    if (userInput.toLowerCase() === 'menu' || userInput.toLowerCase() === 'restart') {
      showMainMenu();
      return;
    }

    // Handle post-submission response
    if (currentStep === -1) {
      if (userInput.toLowerCase().includes('yes')) {
        showMainMenu();
      } else {
        addMessage('Thank you for using our service! 🙏', 'bot');
        setTimeout(() => setIsOpen(false), 2000);
      }
      return;
    }

    // Handle service selection from menu
    if (currentService === 'menu') {
      handleServiceSelection(userInput);
      return;
    }

    // Store form data
    const fieldNames: Record<string, string[]> = {
      'private-vehicle': ['name', 'phone', 'pickupLocation', 'dropLocation', 'day', 'passengers', 'specialRequirements'],
      'private-bus': ['groupName', 'contactPerson', 'phone', 'pickupLocation', 'dropLocation', 'day', 'passengers', 'specialRequirements'],
      'msrtc-bus': ['receipt', 'name', 'phone', 'busNumber', 'day', 'pickupLocation', 'passengers', 'specialRequirements'],
      'train': ['name', 'phone', 'trainNumber', 'arrivalDeparture', 'station', 'day', 'passengers', 'samagamLocation'],
      'flight': ['name', 'phone', 'flightNumber', 'airline', 'arrivalDeparture', 'airport', 'day', 'passengers', 'samagamLocation'],
    };

    const fields = fieldNames[currentService] || [];
    const currentField = fields[currentStep - 1];
    
    if (currentField && currentField !== 'receipt') {
      setFormData(prev => ({ ...prev, [currentField]: userInput }));
    }

    // Move to next question or submit
    const nextQuestion = getNextQuestion(currentService, currentStep + 1);
    
    if (nextQuestion) {
      setCurrentStep(prev => prev + 1);
      addMessage(nextQuestion, 'bot');
    } else {
      await handleFormSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, receipt: file.name }));
      addMessage(`✅ Receipt uploaded: ${file.name}`, 'bot');
      
      const nextQuestion = getNextQuestion(currentService, currentStep + 1);
      if (nextQuestion) {
        setCurrentStep(prev => prev + 1);
        addMessage(nextQuestion, 'bot');
      }
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-96 h-[100dvh] sm:h-[600px] sm:max-h-[80vh] shadow-2xl flex flex-col z-50 border-2 sm:rounded-lg rounded-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-3 sm:p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <h3 className="font-semibold text-sm sm:text-base">Transport Service</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-base ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t bg-white">
            {currentService === 'msrtc-bus' && currentStep === 1 && !uploadedFile ? (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 h-11 sm:h-10 text-sm sm:text-base"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserInput(input)}
                  placeholder="Type your message..."
                  className="flex-1 h-11 sm:h-10 text-sm sm:text-base"
                />
                <Button
                  onClick={() => handleUserInput(input)}
                  size="icon"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 h-11 w-11 sm:h-10 sm:w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2 text-center">
              Type "menu" anytime to restart
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
