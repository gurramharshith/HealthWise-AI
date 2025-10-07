
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/button';
import { MessageCircle, X, Bot } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { runHealthChat } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  role: 'user' | 'model';
  content: string;
};

const initialMessages: Message[] = [
    {
        role: 'model',
        content: 'Hello! I am the HealthWise AI assistant. How can I help you today? \n\n*Disclaimer: I am not a medical professional. Please consult with a doctor for any medical advice.*'
    }
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSubmit = async (input: string) => {
    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('history', JSON.stringify(newMessages));
    
    try {
        const result = await runHealthChat(formData);
        
        if('response' in result && result.response) {
            const modelMessage: Message = { role: 'model', content: result.response };
            setMessages((prev) => [...prev, modelMessage]);
        } else if ('error' in result) {
            toast({
                variant: 'destructive',
                title: 'Chat Error',
                description: result.error,
            });
            setMessages(messages); // Revert to previous state
        }
    } catch (e: any) {
        toast({
            variant: 'destructive',
            title: 'Chat Error',
            description: e.message || 'An unexpected error occurred.',
        });
        setMessages(messages); // Revert to previous state
    } finally {
        setIsLoading(false);
    }

  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-50"
          >
            <Card className="w-[380px] h-[540px] flex flex-col shadow-2xl">
              <CardHeader className='flex flex-row items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Bot className="h-6 w-6 text-primary" />
                    <div>
                        <CardTitle>HealthWise AI</CardTitle>
                        <CardDescription>Your friendly health assistant</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleOpen} className="shrink-0">
                    <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </CardContent>
              <CardFooter className="p-4 border-t">
                <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button onClick={toggleOpen} size="lg" className='rounded-full w-16 h-16 shadow-lg'>
          {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
        </Button>
      </motion.div>
    </>
  );
}
