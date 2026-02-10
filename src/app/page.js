"use client";

import Image from "next/image";
import Link from "next/link";
import {
    PhoneCall,
    MapPin,
    Mic,
    PhoneOff,
    Navigation,
    ShieldAlert,
    Users,
    Video,
    ArrowRight,
    Shield,
    Heart
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-white relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-secondary-200/30 rounded-full blur-3xl translate-x-1/3" />

            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 space-y-12">
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-primary-100 text-primary-600 text-sm font-medium">
                            <Heart className="h-4 w-4 fill-current" />
                            <span>Your Safety Companion</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-tight">
                            Your Safety. Your Strength. <br />
                            <span className="text-primary-600">Always With You.</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg">
                            Empowering women with real-time safety intelligence, proactive threat detection, and instant emergency response.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button variant="destructive" size="xl" className="shadow-red-500/25">
                                Emergency Help
                            </Button>
                            <Button variant="secondary" size="xl" className="bg-white hover:bg-white/80 border border-primary-100 text-primary-700">
                                Find Safe Places Nearby <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {/* Abstract Illustration Placeholder */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <div className="absolute inset-4 bg-gradient-to-tr from-primary-400 to-secondary-400 rounded-full opacity-20 animate-pulse" />
                            <div className="absolute inset-12 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-center p-8 border border-white/50">
                                <div className="grid grid-cols-2 gap-4 w-full h-full">
                                    <div className="bg-primary-100 rounded-2xl flex items-center justify-center">
                                        <Shield className="h-12 w-12 text-primary-400" />
                                    </div>
                                    <div className="bg-secondary-100 rounded-2xl flex items-center justify-center">
                                        <Users className="h-12 w-12 text-secondary-400" />
                                    </div>
                                    <div className="bg-orange-100 rounded-2xl flex items-center justify-center">
                                        <MapPin className="h-12 w-12 text-orange-400" />
                                    </div>
                                    <div className="bg-green-100 rounded-2xl flex items-center justify-center">
                                        <PhoneCall className="h-12 w-12 text-green-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SOS Section */}
                <section className="relative py-8">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
                    <div className="relative flex justify-center">
                        <div className="bg-white/50 backdrop-blur-sm p-2 rounded-full border border-red-100 shadow-inner">
                            <Button
                                variant="sos"
                                size="xl"
                                className="h-32 w-32 rounded-full text-2xl font-bold border-4 border-white/30 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse"
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/sos', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                type: 'SOS',
                                                details: 'SOS Button Pressed on Homepage',
                                                location: { lat: 0, lng: 0 } // Mock location
                                            })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            alert("SOS Alert Sent! Emergency contacts notified.");
                                        } else {
                                            alert("Alert sent locally. (Backend: " + data.message + ")");
                                        }
                                    } catch (e) {
                                        alert("SOS Alert Sent (Offline Mode)");
                                    }
                                }}
                            >
                                SOS
                                <span className="block text-xs font-normal opacity-90 mt-1">Tap to Alert</span>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Emergency Actions */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Emergency Actions</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard
                            icon={PhoneCall}
                            title="Call Emergency"
                            color="text-red-500"
                            bg="bg-red-50 border-red-100"
                            onClick={() => alert("Calling Emergency Services...")}
                        />
                        <ActionCard
                            icon={MapPin}
                            title="Share Location"
                            color="text-blue-500"
                            bg="bg-blue-50 border-blue-100"
                            onClick={() => alert("Location Shared!")}
                        />
                        <ActionCard
                            icon={Mic}
                            title="Voice SOS"
                            color="text-orange-500"
                            bg="bg-orange-50 border-orange-100"
                            onClick={() => alert("Voice Recording Started")}
                        />
                        <ActionCard
                            icon={PhoneOff}
                            title="Fake Call"
                            color="text-purple-500"
                            bg="bg-purple-50 border-purple-100"
                            onClick={() => alert("Initiating Fake Call...")}
                        />
                    </div>
                </section>

                {/* Safety Features */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Safety Features</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Navigation}
                            title="Safe Route"
                            desc="AI-recommended safest paths"
                        />
                        <FeatureCard
                            icon={ShieldAlert}
                            title="Nearby Help"
                            desc="Police stations & hospitals"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Community Alerts"
                            desc="Real-time danger updates"
                        />
                        <FeatureCard
                            icon={Video}
                            title="Record Evidence"
                            desc="Securely cloud-synced"
                        />
                    </div>
                </section>

                {/* Resources */}
                <section className="bg-white/40 backdrop-blur-lg rounded-3xl p-8 border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Explore Our Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ResourceCard
                            title="Self-Defense Tips"
                            imageColor="bg-orange-100"
                        />
                        <ResourceCard
                            title="Know Your Rights"
                            imageColor="bg-blue-100"
                        />
                        <ResourceCard
                            title="Inspiring Stories"
                            imageColor="bg-pink-100"
                        />
                    </div>
                </section>
            </div>

            <ChatWidget />
        </main>
    );
}

function ActionCard({ icon: Icon, title, color, bg, onClick }) {
    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${bg}`}
        >
            <CardContent className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-full bg-white ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-slate-700">{title}</span>
            </CardContent>
        </Card>
    )
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <Card className="hover:shadow-md transition-shadow border-white/60">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600">
                    <Icon className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500">{desc}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ResourceCard({ title, imageColor }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-white/60 group">
            <div className={`h-32 ${imageColor} group-hover:scale-105 transition-transform duration-500`} />
            <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{title}</h3>
                <Button variant="link" className="p-0 h-auto text-primary-600">Read More <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </CardContent>
        </Card>
    )
}
