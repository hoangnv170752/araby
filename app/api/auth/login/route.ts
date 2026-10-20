import { authenticateUser } from "../../../lib/auth";
import { createSession } from "../../../lib/session";

// POST: Login with email and password
export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  try {
    const result = await authenticateUser(email, password);

    if (!result.success) {
      const statusCode =
        result.error === "USER_NOT_FOUND" || result.error === "INVALID_PASSWORD"
          ? 401
          : 400;
      return Response.json({ error: result.error }, { status: statusCode });
    }

    // Create session and set cookie
    await createSession({
      userId: result.user!.id,
      email: result.user!.email,
      role: result.user!.role,
    });

    return Response.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error("[auth/login] error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
