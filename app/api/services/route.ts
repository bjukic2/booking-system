import { NextResponse } from "next/server";
import { serviceService } from "@/backend/modules/services/service.service";
import { ClinicRequest } from "@/types/next";

export async function GET(req: ClinicRequest) {
  try {
    const services = await serviceService.getByClinic(req.clinicId);
    return NextResponse.json(services);
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

    const clinicId = Number(req.headers.get("x-clinic-id"));

    const service = await serviceService.create({
      ...body,
      clinicId,
    });

    return NextResponse.json(service);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
