import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword, updateAdminPassword } from "@/lib/portfolioData";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "portfolio_admin_token";
const SESSION_SECRET = "portfolio-admin-session-authenticated-key";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token === SESSION_SECRET) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, oldPassword, newPassword } = body;
    const cookieStore = await cookies();

    if (action === "login") {
      const currentPassword = getAdminPassword();
      if (password === currentPassword) {
        cookieStore.set(AUTH_COOKIE_NAME, SESSION_SECRET, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return NextResponse.json({ success: true, message: "Logged in successfully" });
      } else {
        return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
      }
    }

    if (action === "logout") {
      cookieStore.delete(AUTH_COOKIE_NAME);
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    if (action === "change_password") {
      const currentPassword = getAdminPassword();
      if (oldPassword !== currentPassword) {
        return NextResponse.json({ success: false, message: "Current password does not match" }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 3) {
        return NextResponse.json({ success: false, message: "New password must be at least 3 characters" }, { status: 400 });
      }

      const updated = updateAdminPassword(newPassword);
      if (updated) {
        return NextResponse.json({ success: true, message: "Password updated successfully" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update password" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

