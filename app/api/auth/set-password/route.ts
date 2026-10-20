import { createOrUpdateAdmin } from "../../../lib/auth";

// POST: Set password for admin user
// This should be protected or removed after initial setup
export async function POST(request: Request) {
  const { email, password, adminSecret } = await request.json();

  // Simple protection: require admin secret from env
  if (adminSecret !== process.env.ADMIN_SETUP_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return Response.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  try {
    const result = await createOrUpdateAdmin(email, password);
    return Response.json(result);
  } catch (error) {
    console.error("[auth/set-password] error:", error);
    return Response.json(
      { error: "Failed to set password" },
      { status: 500 }
    );
  }
}
