import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
    const supabase = createClient()

    try {

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        const { data, error } = await supabase
            .from('reservations')
            .select("*")
            .eq('user_id', userId)
        if (error) return NextResponse.json({ error: error.message, status: 400 })

    } catch (e) {
        return NextResponse.json({ error: "Failed getting reservations", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const supabase = createClient()

    try {

        const body = await req.json()
        const { user_id, item_id } = body

        const { data: item_res, error: item_error } = await supabase
            .from("item")
            .select("*")
            .eq("id", item_id)
        if (item_error) return NextResponse.json({ error: item_error.message, status: 400 })
        if (!item_res.length) return NextResponse.json({ error: "Item_id error", status: 400 })

        const { error: create_reservation_error } = await supabase
            .from("reservations")
            .insert({ user_id, item_id })
        if (create_reservation_error) return NextResponse.json({ error: create_reservation_error.message, status: 400 })
        
        return NextResponse.json({ success: true })

    } catch (e) {
        return NextResponse.json({ error: "Failed creating reservation", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}