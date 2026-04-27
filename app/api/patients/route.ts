import { NextResponse } from "next/server";
import { patientService } from "@/backend/modules/patients/patient.service";
import { ClinicRequest } from "@/types/next";

export async function GET(req: ClinicRequest) {
  try {
    const patients = await patientService.getByClinic(req.clinicId);
    return NextResponse.json(patients);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const patient = await patientService.create(body);
    return NextResponse.json(patient);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
