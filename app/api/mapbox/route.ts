import { NextRequest, NextResponse } from "next/server";

export default function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({ token: process.env.MAPBOX_TOKEN, status: 200 })
}