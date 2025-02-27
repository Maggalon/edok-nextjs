import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient()

        const body = await req.json()
        console.log(body.coordinates);

        const { data, error } = await supabase.rpc('get_specific_points', {
            point_values: body.coordinates
        })
        if (error) return NextResponse.json({ error: error.message, status: 400 })

        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Failed getting branches", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = createClient()
        const { searchParams } = new URL(req.url)

        const branchId = searchParams.get("branchId")

        const { data: branchMenus, error: menuError } = await supabase
            .from('menu')
            .select('id')
            .eq('branchid', branchId);

        if (menuError) {
            console.error('Error fetching menus:', menuError);
            return;
        }

            // Then, get items for those menus
        const menuIds = branchMenus.map(menu => menu.id);
        const { data: items, error: itemsError } = await supabase
            .from('item')
            .select('*')
            .in('menuid', menuIds);
        if (itemsError) return NextResponse.json({ error: itemsError.message, status: 400 })

        return NextResponse.json({ items })
    } catch(e) {
        return NextResponse.json({ error: "Failed getting items of branch", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
    }
}