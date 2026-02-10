
import { NextResponse } from 'next/server';
import { connectSQL } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    try {
        await connectSQL();
        const users = await User.findAll();
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectSQL();
        const body = await req.json();
        const user = await User.create(body);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
