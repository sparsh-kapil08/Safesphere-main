
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db';
import Log from '@/lib/models/Log';

export async function POST(req) {
    try {
        await connectMongo();
        const body = await req.json();

        const newLog = await Log.create({
            type: body.type || 'SOS',
            details: body.details || 'Emergency button pressed',
            location: body.location,
        });

        return NextResponse.json({ success: true, data: newLog }, { status: 201 });
    } catch (error) {
        // Graceful fallback if Mongo isn't running locally
        console.error("Database connection error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to log to database (is MongoDB running?). Processed locally.",
                error: error.message
            },
            { status: 500 }
        );
    }
}
