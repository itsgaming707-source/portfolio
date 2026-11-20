import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolioData";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "portfolio_admin_token";
const SESSION_SECRET = "portfolio-admin-session-authenticated-key";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token === SESSION_SECRET;
}

export async function GET() {
  const data = getPortfolioData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ success: false, message: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data || !data.profile) {
      return NextResponse.json({ success: false, message: "Invalid portfolio data" }, { status: 400 });
    }

    const saved = savePortfolioData(data);
    if (saved) {
      try {
        revalidatePath("/");
        revalidatePath("/nikhil-yadav");
      } catch (err) {
        // Revalidation error if any is non-fatal
      }
      return NextResponse.json({ success: true, message: "Portfolio updated successfully!", data });
    } else {
      return NextResponse.json({ success: false, message: "Failed to save portfolio data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

