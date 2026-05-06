import { NextResponse } from "next/server";
import { clinicService } from "@/backend/modules/clinics/clinic.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ domain: string }> },
) {
  const { domain } = await context.params;
  try {
    const clinic = await clinicService.getByDomain(domain);
    return NextResponse.json(clinic);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
