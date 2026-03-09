import { auth } from "@/features/auth/auth";
import { headers } from "next/headers";

export async function getSessionUser() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return { user: undefined };
  }

  return { user: session.user };
}
