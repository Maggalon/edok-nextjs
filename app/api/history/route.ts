import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

interface History {
    id: string;
    user_id: number;
    created_at: string;
    price: number;
    menu: {
        id: string;
        name: string;
        weight: number;
        initialprice: number;
        branch: {
            company: {
                id: string;
                name: string;
                logo: string;
            }
        }
    }
}

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
                            id,
                            name,
                            logo
                        )
                    )    
                )
            `)
            .eq('user_id', userId) as unknown as { data: History[], error: any }
        if (error) return NextResponse.json({ error: error.message, status: 400 })
        
        for (const item of data) {
            const logoUrl = await supabase
                .storage
                .from("companies")
                .createSignedUrl(`${item.menu.branch.company.id}/${item.menu.branch.company.logo}`, 600)
            item.menu.branch.company.logo = logoUrl.data!.signedUrl
        }
        
        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Failed getting history", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const supabase = createClient()

    try {

        const body = await req.json()
        const { menuId } = body

        const { data, error } = await supabase
            .from("item")
            .select("*")
            .eq("menuid", menuId)
        if (error) return NextResponse.json({ error: error.message, status: 400 })
        console.log(data);

        if (!data.length) return NextResponse.json({ message: "Item currently is not available", status: 400 })
        
        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Failed getting history", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}