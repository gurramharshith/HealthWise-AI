
'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="Ask a health question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        autoFocus
      />
      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
      </Button>
    </form>
  );
}
