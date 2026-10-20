import { cookies } from "next/headers";
import { checkInviteCode, useInviteCode } from "../../lib/invite-code";
import { verifySession } from "../../lib/session";

const HALAL_BITES_API = "https://api.halalbites.co/list";
const HALAL_BITES_API_KEY = process.env.HALAL_BITES_API_KEY;
const INVITE_CODE_COOKIE = "araby_invite_code";

interface HalalFinderRequest {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  offset?: number;
  is_open_now?: boolean;
  is_food_truck?: boolean;
  is_certified?: boolean;
  is_zabiha_halal?: boolean;
  is_alcohol_free?: boolean;
  is_fully_halal?: boolean;
  sort_by?: "distance" | "rating";
  cuisine_id?: number[];
  inviteCode?: string;
}

async function verifyAccess(request: Request): Promise<{ valid: boolean; inviteCode?: string }> {
  // First check admin session
  const session = await verifySession();
  if (session) {
    return { valid: true };
  }

  // Check invite code from cookie
  const cookieStore = await cookies();
  const inviteCodeFromCookie = cookieStore.get(INVITE_CODE_COOKIE)?.value;

  if (inviteCodeFromCookie) {
    const result = await checkInviteCode(inviteCodeFromCookie);
    if (result.valid) {
      return { valid: true, inviteCode: inviteCodeFromCookie };
    }
  }

  // Check invite code from header
  const inviteCodeFromHeader = request.headers.get("X-Invite-Code");
  if (inviteCodeFromHeader) {
    const result = await checkInviteCode(inviteCodeFromHeader);
    if (result.valid) {
      return { valid: true, inviteCode: inviteCodeFromHeader };
    }
  }

  return { valid: false };
}

export async function POST(request: Request) {
  const body: HalalFinderRequest = await request.json();

  // Check invite code from body (for first-time usage)
  let accessResult = await verifyAccess(request);

  if (!accessResult.valid && body.inviteCode) {
    const result = await checkInviteCode(body.inviteCode);
    if (result.valid) {
      accessResult = { valid: true, inviteCode: body.inviteCode };

      // Set cookie for future requests
      const cookieStore = await cookies();
      cookieStore.set(INVITE_CODE_COOKIE, body.inviteCode.toUpperCase(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
  }

  if (!accessResult.valid) {
    return Response.json(
      { error: "Unauthorized. Please use a valid invite code." },
      { status: 401 }
    );
  }

  // Track usage if invite code is being used
  if (accessResult.inviteCode) {
    await useInviteCode(accessResult.inviteCode, {
      featureUsed: "halal-finder",
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
  }

  if (!HALAL_BITES_API_KEY) {
    console.error("[halal-finder] HALAL_BITES_API_KEY not configured");
    return Response.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const body: HalalFinderRequest = await request.json();

    if (!body.lat || !body.lng) {
      return Response.json(
        { error: "Location (lat, lng) required" },
        { status: 400 }
      );
    }

    // Build request payload
    const payload = {
      lat: body.lat,
      lng: body.lng,
      user_lat: body.lat,
      user_lng: body.lng,
      radius: body.radius ?? 10,
      limit: Math.min(body.limit ?? 20, 50),
      offset: body.offset ?? 0,
      is_open_now: body.is_open_now ?? false,
      is_food_truck: body.is_food_truck ?? false,
      is_certified: body.is_certified ?? false,
      is_zabiha_halal: body.is_zabiha_halal ?? false,
      is_alcohol_free: body.is_alcohol_free ?? false,
      is_fully_halal: body.is_fully_halal ?? false,
      sort_by: body.sort_by ?? "distance",
      cuisine_id: body.cuisine_id ?? [],
      map_location_datetime: new Date().toISOString().replace("T", " ").slice(0, 19),
    };

    const res = await fetch(HALAL_BITES_API, {
      method: "POST",
      headers: {
        "x-api-key": HALAL_BITES_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[halal-finder] API error:", res.status, await res.text());
      return Response.json(
        { error: "Failed to fetch halal restaurants" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.success || !data.data?.success) {
      return Response.json(
        { error: "No results found" },
        { status: 404 }
      );
    }

    // Transform response
    const restaurants = data.data.items.map((item: {
      id: string;
      restaurant_name: string;
      restaurant_address: string;
      restaurant_lat: string;
      restaurant_long: string;
      curr_location_distance: number;
      restaurant_image: string;
      restaurant_timings: Array<{ day: number; opening_time: string; closing_time: string }>;
      cuisines: Array<{ title: string }>;
    }) => ({
      id: item.id,
      name: item.restaurant_name,
      address: item.restaurant_address,
      lat: parseFloat(item.restaurant_lat),
      lng: parseFloat(item.restaurant_long),
      distance: item.curr_location_distance,
      image: item.restaurant_image
        ? `https://api.halalbites.co/storage/${item.restaurant_image}`
        : null,
      timings: item.restaurant_timings,
      cuisines: item.cuisines?.map((c) => c.title) ?? [],
    }));

    return Response.json({
      restaurants,
      hasMore: data.data.hasMore,
      nextRadius: data.data.nextRadius,
    });
  } catch (error) {
    console.error("[halal-finder] error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
