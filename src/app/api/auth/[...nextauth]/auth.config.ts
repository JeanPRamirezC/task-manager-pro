// src/app/api/auth/[...nextauth]/auth.config.ts
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" }, // 👈 clave
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token?.sub) session.user.id = token.sub;
      return session;
    },
  },
};
