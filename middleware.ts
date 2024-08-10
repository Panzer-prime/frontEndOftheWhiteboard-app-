// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.NEXT_JWT_SECRET || "secret";

export async function middleware(req: NextRequest) {
  // const { cookies } = req;
  // const token = (cookies as any)["token"] ;
  // if (!token) {
  //   return NextResponse.redirect(new URL("auth/log-in", req.url));
  // }
  // try{
  //   jwtVerify(token, new TextEncoder().encode(secret))
  //   return NextResponse.next()
  // }catch{
  //   return NextResponse.redirect(new URL("auth/log-in", req.url))
  // }
}

// Specify paths where middleware should run
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"], // Adjust paths as necessary
};
