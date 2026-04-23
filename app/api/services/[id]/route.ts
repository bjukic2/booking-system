import { NextResponse } from "next/server";
import { serviceService } from "@/backend/modules/services/service.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const service = await serviceService.getById(Number(params.id));
    return NextResponse.json(service);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
