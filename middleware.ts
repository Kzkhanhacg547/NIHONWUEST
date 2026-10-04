import { withAuth } from "next-auth/middleware";

function requiredSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "NEXTAUTH_SECRET is missing or shorter than 32 characters. Set it before starting the server.",
    );
  }
  return secret;
}

export default withAuth({ secret: requiredSecret() });

export const config = {
  matcher: ["/app/:path*", "/onboarding"],
};