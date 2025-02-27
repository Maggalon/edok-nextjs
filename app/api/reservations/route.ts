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
        
        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Failed getting reservations", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const supabase = createClient()

    try {

        const body = await req.json()
        const { user_id, item_id, quantity } = body

        const { data: item_res, error: item_error } = await supabase
            .from("item")
            .select("*")
            .eq("id", item_id)
        if (item_error) return NextResponse.json({ error: item_error.message, status: 400 })
        if (!item_res.length) return NextResponse.json({ error: "Item_id error", status: 400 })
        console.log(quantity);

        const { data: existingReservation, error: checkReservationError } = await supabase
            .from('reservations')
            .select('id, quantity')
            .eq('user_id', user_id)
            .eq("item_id", item_id)
            .single()
        if (checkReservationError) return NextResponse.json({ error: "Failed to check if reservation exists: " + checkReservationError.message, status: 400 })
        
        if (existingReservation) {
            const { error: updateReservationError } = await supabase
                .from("reservations")
                .update({
                    quantity: existingReservation.quantity + quantity
                })
                .eq('id', existingReservation.id)
            if (updateReservationError) return NextResponse.json({ error: "Failed to update reservation: " + updateReservationError.message, status: 400 })
        } else {
            const { error: create_reservation_error } = await supabase
                .from("reservations")
                .insert({ user_id, item_id, quantity })
            if (create_reservation_error) return NextResponse.json({ error: "Failed to create reservation: " + create_reservation_error.message, status: 400 })
        }
        
        const { error: decrease_item_quantity_error } = await supabase
            .from("item")
            .update({ quantity: item_res[0].quantity - quantity })
            .eq("id", item_id)
        if (decrease_item_quantity_error) return NextResponse.json({ error: "Failed to decrease item quantity: " + decrease_item_quantity_error.message, status: 400 })
        
        return NextResponse.json({ success: true })

    } catch (e) {
        return NextResponse.json({ error: "Failed creating reservation", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}