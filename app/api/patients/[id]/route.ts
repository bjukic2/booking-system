import { NextResponse } from "next/server";
import { patientService } from "@/backend/modules/patients/patient.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const patient = await patientService.getById(Number(params.id));
    return NextResponse.json(patient);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
