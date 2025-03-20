import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
    const supabase = createClient()

    try {

        const body = await req.json()
        const { name, contacts } = body

        const { error } = await supabase
            .from("contacts")
            .insert({ name, contacts })
        if (error) return NextResponse.json({ error: error.message, status: 400 })
                
        return NextResponse.json({ success: true })

    } catch (e) {
        return NextResponse.json({ error: "Failed inserting contacts", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}