import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
	const isLoggedIn = !!req.auth
	const { pathname } = req.nextUrl

	const isAdminRoute = pathname.startsWith("/admin")

	//Auth routes
	const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")

	if (isLoggedIn && isAuthRoute) {
		const role = req.auth?.user?.role
		if (role === "ADMIN") {
			return NextResponse.redirect(new URL("/admin", req.url))
		}
		return NextResponse.redirect(new URL("/", req.url))
	}

	if (!isAdminRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL("/login", req.url))
		}

		const role = req.auth?.user?.role
		if (role !== "ADMIN") {
			return NextResponse.redirect(new URL("/", req.url))
		}
	}
	const protectedUserRoutes = ["/orders", "/profile", "/cart/checkout"]
	const isProtectedUserRoute = protectedUserRoutes.some(route => pathname.startsWith(route))
	
	if (isProtectedUserRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", req.url))
	}
	return NextResponse.next()
})

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
