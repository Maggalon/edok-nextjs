import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

interface Item {
  id: string;
  quantity: number;
  newprice: number;
  collectday: string;
  collecttimerange: string;
  menu: {
    name: string;
    description: string;
    type: string;
    image: string;
    initialprice: number;
    branch: {
      address: string;
      coordinates: string;
      ratingsum: number;
      votesnubmer: number;
      company: {
        id: string;
        name: string;
        logo: string;
      }
    }
  }
}

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
                id,
                name,
                logo
              )
            )
          )
        `) as { data: Item[], error: any }

    if (error) return NextResponse.json({ error: error.message, status: 400 })

    for (const item of results) {
      const logoUrl = await supabase
        .storage
        .from("companies")
        .createSignedUrl(`${item.menu.branch.company.id}/${item.menu.branch.company.logo}`, 600)
      const imageUrl = await supabase
        .storage
        .from("menu")
        .createSignedUrl(`${item.menu.branch.company.id}/${item.menu.image}`, 600)
      item.menu.image = imageUrl.data!.signedUrl
      item.menu.branch.company.logo = logoUrl.data!.signedUrl
    }
    
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
              id,
              name,
              logo
            )
          )
        )
      `)
      .in('id', body.item_ids) as unknown as { data: Item[], error: any }
    if (error) return NextResponse.json({ error: error.message, status: 400 })
    console.log(data);

    for (const item of data) {
      const logoUrl = await supabase
        .storage
        .from("companies")
        .createSignedUrl(`${item.menu.branch.company.id}/${item.menu.branch.company.logo}`, 600)
      const imageUrl = await supabase
        .storage
        .from("menu")
        .createSignedUrl(`${item.menu.branch.company.id}/${item.menu.image}`, 600)
      item.menu.image = imageUrl.data!.signedUrl
      item.menu.branch.company.logo = logoUrl.data!.signedUrl
    }
    
    return NextResponse.json({ data })

  } catch(e) {
    console.error('Error getting items:', e);
    return NextResponse.json({ error: "Failed getting items", details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}