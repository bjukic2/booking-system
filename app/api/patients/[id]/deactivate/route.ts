import { NextResponse } from "next/server";
import { patientService } from "@/backend/modules/patients/patient.service";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const result = await patientService.deactivatePatient(Number(id));
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
