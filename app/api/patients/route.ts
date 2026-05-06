import { NextResponse } from "next/server";
import { patientService } from "@/backend/modules/patients/patient.service";

export async function GET(req: Request) {
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit") ?? 20);
    const offset = Number(searchParams.get("offset") ?? 0);

    const [items, total] = await Promise.all([
      patientService.getPaginatedPatients(clinicId, limit, offset),
      patientService.countPatients(clinicId),
    ]);

    return NextResponse.json({
      items,
      total,
      limit,
      offset,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const clinicId = Number(req.headers.get("x-clinic-id"));
    const body = await req.json();
    const patient = await patientService.create({
      ...body,
      clinicId,
    });
    return NextResponse.json(patient);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
