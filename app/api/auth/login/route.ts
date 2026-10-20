import { authenticateUser } from "../../../lib/auth";

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

    // TODO: Generate JWT token or session here
    // For now, just return user info
    return Response.json({
      success: true,
      user: result.user,
      // token: generateJWT(result.user), // Add JWT later
    });
  } catch (error) {
    console.error("[auth/login] error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
