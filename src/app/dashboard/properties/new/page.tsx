import { Role } from "@prisma/client";
import { requireUser } from "@/lib/session";
import { PropertyWizard } from "@/components/properties/property-wizard";

export const metadata = { title: "Novo imóvel" };

export default async function NewPropertyPage() {
  const user = await requireUser();
  return (
    <PropertyWizard isAdmin={user.role === Role.ADMIN} />
  );
}
