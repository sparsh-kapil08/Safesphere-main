'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I'm Sakhi. How can I assist you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const quickPrompts = [
        "I feel unsafe",
        "Someone is following me",
        "Legal Help"
    ];

    const handleSend = (text) => {
        setMessages(prev => [...prev, { text, sender: 'user' }]);

        // Simulate bot response
        setTimeout(() => {
            let response = "I'm here to help. Connecting you to resources...";
            if (text.includes("unsafe")) response = "Stay calm. Sharing your live location with emergency contacts. Press the SOS button if needed.";
            else if (text.includes("following")) response = "Head to the nearest crowded place. I'm alerting the nearest police patrol.";
            else if (text.includes("Legal")) response = "Here are some legal rights every woman should know...";

            setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
        }, 1000);
        setInputValue('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 sm:w-96"
                    >
                        <Card className="flex flex-col h-[500px] overflow-hidden border-2 border-primary-200">
                            <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        🤖
                                    </div>
                                    <span className="font-semibold">Sakhi AI Assistant</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                ? 'bg-primary-600 text-white rounded-br-none'
                                                : 'bg-white shadow-sm border border-primary-100 text-slate-800 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white border-t border-primary-100">
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => handleSend(prompt)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-200 hover:bg-primary-100 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && inputValue && handleSend(inputValue)}
                                        placeholder="Type a message..."
                                    />
                                    <Button size="icon" onClick={() => inputValue && handleSend(inputValue)}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full shadow-2xl bg-primary-600 hover:bg-primary-700 text-white p-0 relative"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </Button>
        </div>
    );
}
