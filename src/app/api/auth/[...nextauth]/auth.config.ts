// src/app/api/auth/[...nextauth]/auth.config.ts
import type { AuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import GitHubProvider from "next-auth/providers/github";

export const authConfig: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    // Puedes agregar más proveedores aquí
  ],
  pages: { signIn: "/login" },
  // Usamos JWT para que el middleware pueda leer el token con getToken()
  session: { strategy: "jwt" as const },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token?.sub) {
        // Si tienes los tipos extendidos de next-auth, quita el "as any"
        (session.user).id = token.sub;
      }
      return session;
    },
  },
};
