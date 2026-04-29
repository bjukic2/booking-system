import { NextResponse } from "next/server";
import { clinicService } from "@/backend/modules/clinics/clinic.service";
import { UpdateClinicInput } from "@/backend/modules/clinics/clinic.types";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const clinic = await clinicService.getById(Number(id));
    return NextResponse.json(clinic);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const body: UpdateClinicInput = await req.json();
    const updated = await clinicService.updateClinic(Number(id), body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
