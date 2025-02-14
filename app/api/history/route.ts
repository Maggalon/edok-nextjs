import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
    const supabase = createClient()

    try {

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        const { data, error } = await supabase
            .from('history')
            .select(`
                id,
                user_id,
                created_at,
                price,
                menu (
                    id,
                    name,
                    weight,
                    initialprice,
                    branch (
                        company (
                            name,
                            logo
                        )
                    )    
                )
            `)
            .eq('user_id', userId)
        if (error) return NextResponse.json({ error: error.message, status: 400 })
        
        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Failed getting history", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}