import { NextResponse } from "next/server";
import { clinicService } from "@/backend/modules/clinics/clinic.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clinic = await clinicService.create(body);
    return NextResponse.json(clinic);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clinics = await clinicService.getAll();
    return NextResponse.json(clinics);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
