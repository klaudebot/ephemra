import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/feed/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/bookmarks/:path*",
    "/explore/:path*",
    "/messages/:path*",
    "/post/:path*",
  ],
};
