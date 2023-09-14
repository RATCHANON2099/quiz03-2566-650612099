import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Ratchanon Chunsakunee",
    studentId: "650612099",
  });
};
