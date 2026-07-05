import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const answer = normalize(body.answer);

    const expected = normalize(process.env.BOOK_PASSCODE || "Buttercup");

    if (answer !== expected) {
      return NextResponse.json(
        {
          ok: false,
          message: "Wrong answer. Try again with love."
        },
        { status: 401 }
      );
    }

    cookies().set("kasturi_book_opened", "yes", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return NextResponse.json({
      ok: true,
      message: "The book is open."
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong."
      },
      { status: 500 }
    );
  }
}
