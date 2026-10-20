import { deleteSession } from "../../../lib/session";

// POST: Logout - clear session cookie
export async function POST() {
  try {
    await deleteSession();
    return Response.json({ success: true });
  } catch (error) {
    console.error("[auth/logout] error:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
