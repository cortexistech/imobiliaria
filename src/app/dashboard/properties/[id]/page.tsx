import { notFound } from "next/navigation";
import { PropertyStatus, Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { asImages } from "@/lib/utils";
import { PropertyWizard } from "@/components/properties/property-wizard";
import { deleteProperty, setPropertyStatus } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/properties/status-badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
      ...(user.role === Role.ADMIN ? {} : { agentId: user.id }),
    },
    select: { title: true },
  });
  return { title: property?.title ?? "Imóvel" };
}

export default async function PropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
      ...(user.role === Role.ADMIN ? {} : { agentId: user.id }),
    },
  });
  if (!property) notFound();

  async function publish() {
    "use server";
    await setPropertyStatus(id, PropertyStatus.PUBLISHED);
  }
  async function reject() {
    "use server";
    await setPropertyStatus(id, PropertyStatus.DRAFT);
  }
  async function remove() {
    "use server";
    await deleteProperty(id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={property.status} />
        <div className="flex flex-wrap gap-2">
          {user.role === Role.ADMIN && property.status !== "PUBLISHED" ? (
            <form action={publish}>
              <Button type="submit" variant="survey">
                Aprovar e publicar
              </Button>
            </form>
          ) : null}
          {user.role === Role.ADMIN && property.status === "PENDING" ? (
            <form action={reject}>
              <Button type="submit" variant="outline">
                Devolver a rascunho
              </Button>
            </form>
          ) : null}
          <form action={remove}>
            <Button type="submit" variant="danger">
              Eliminar
            </Button>
          </form>
        </div>
      </div>
      <PropertyWizard
        propertyId={property.id}
        isAdmin={user.role === Role.ADMIN}
        initial={{
          title: property.title,
          description: property.description,
          type: property.type as never,
          price: Number(property.price),
          address: property.address,
          city: property.city,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          latitude: property.latitude,
          longitude: property.longitude,
          images: asImages(property.images),
          status: property.status,
        }}
      />
    </div>
  );
}
