import { NextResponse } from "next/server";
import { patientService } from "@/backend/modules/patients/patient.service";

export async function GET(
  req: Request,
  { params }: { params: { phone: string } },
) {
  try {
    const patient = await patientService.getByPhone(params.phone);
    return NextResponse.json(patient);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
