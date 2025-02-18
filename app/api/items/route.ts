import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {

  try {
    const supabase = createClient()
    
    const { data: results, error } = await supabase
        .from('item')
        .select(`
          id,
          quantity,
          newprice,
          collectday,
          collecttimerange,
          menu (
            name,
            description,
            type,
            image,
            initialprice,
            branch (
              address,
              coordinates,
              ratingsum,
              votesnumber,
              company (
                name,
                logo
              )
            )
          )
        `)

    if (error) return NextResponse.json({ error: error.message, status: 400 })

    return NextResponse.json({ results })
  } catch (e) {
    console.error('Error getting items:', e);
    return NextResponse.json({ error: "Failed getting items", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient()

  try {

    const body = await req.json()
    console.log(body.item_ids);
    
    //const item_ids = JSON.parse(body.item_ids)

    const { data, error } = await supabase
      .from("item")
      .select(`
        id,
        quantity,
        newprice,
        collectday,
        collecttimerange,
        menu (
          name,
          description,
          type,
          image,
          initialprice,
          branch (
            address,
            coordinates,
            ratingsum,
            votesnumber,
            company (
              name,
              logo
            )
          )
        )
      `)
      .in('id', body.item_ids)
    if (error) return NextResponse.json({ error: error.message, status: 400 })
    console.log(data);
    
    return NextResponse.json({ data })

  } catch(e) {
    console.error('Error getting items:', e);
    return NextResponse.json({ error: "Failed getting items", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}