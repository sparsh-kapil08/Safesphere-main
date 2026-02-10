
import Link from 'next/link';
import { Button } from './ui/button';
import { Shield, User } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/30 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                        {/* Make sure to import Image from next/image at the top if not already present */}
                        <img src="/logo.svg" alt="SafeSphere Logo" className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
                        SafeSphere
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="#" className="hover:text-primary-600 transition-colors">Home</Link>
                    <Link href="#" className="hover:text-primary-600 transition-colors">Safety Tips</Link>
                    <Link href="#" className="hover:text-primary-600 transition-colors">Resources</Link>
                    <Link href="#" className="hover:text-primary-600 transition-colors">Contact</Link>
                </div>

                <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">My Profile</span>
                </Button>
            </div>
        </nav>
    );
}
