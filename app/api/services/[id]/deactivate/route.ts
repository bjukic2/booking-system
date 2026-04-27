import { NextResponse } from "next/server";
import { serviceService } from "@/backend/modules/services/service.service";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const result = await serviceService.deactivateService(Number(params.id));
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
