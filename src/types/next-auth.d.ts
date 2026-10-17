import { Role } from "@/generated/prisma/enums";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      tenantId: string;
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    tenantId: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    tenantId?: string;
    phone?: string;
    expired?: boolean;
  }
}
