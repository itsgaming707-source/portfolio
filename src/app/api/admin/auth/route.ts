import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials, updateAdminCredentials } from "@/lib/portfolioData";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "portfolio_admin_token";
const SESSION_SECRET = "portfolio-admin-session-authenticated-key";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token === SESSION_SECRET) {
    const creds = getAdminCredentials();
    return NextResponse.json({ authenticated: true, username: creds.username });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, password, oldPassword, newUsername, newPassword } = body;
    const cookieStore = await cookies();
    const creds = getAdminCredentials();

    if (action === "login") {
      const matchUsername = username?.trim().toLowerCase() === creds.username.toLowerCase();
      const matchPassword = password === creds.password;

      if (matchUsername && matchPassword) {
        cookieStore.set(AUTH_COOKIE_NAME, SESSION_SECRET, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return NextResponse.json({ success: true, message: "Logged in successfully", username: creds.username });
      } else {
        return NextResponse.json({ success: false, message: "Invalid Admin ID or Password" }, { status: 401 });
      }
    }

    if (action === "logout") {
      cookieStore.delete(AUTH_COOKIE_NAME);
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    if (action === "change_credentials" || action === "change_password") {
      if (oldPassword !== creds.password) {
        return NextResponse.json({ success: false, message: "Current password does not match" }, { status: 400 });
      }
      if (newPassword && newPassword.length < 3) {
        return NextResponse.json({ success: false, message: "New password must be at least 3 characters" }, { status: 400 });
      }

      const updated = updateAdminCredentials({
        username: newUsername || creds.username,
        password: newPassword || creds.password,
      });

      if (updated) {
        return NextResponse.json({ success: true, message: "Admin credentials updated successfully" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update credentials" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
