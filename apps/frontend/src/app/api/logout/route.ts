import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`;

export async function GET(req: NextRequest) {
  try {
    const res = await axios.get(URI, { withCredentials: true });

    return NextResponse.json({
      msg: "successfully logged out",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      msg: "there was an error",
    });
  }
}
