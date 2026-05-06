import { patientService } from "@/backend/modules/patients/patient.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? "";
    const clinicId = Number(req.headers.get("x-clinic-id"));

    const results = await patientService.searchPatients(clinicId, query);
    return NextResponse.json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
