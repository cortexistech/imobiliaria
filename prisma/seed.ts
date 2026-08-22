import { PrismaClient, Role, PropertyStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const photos = {
  palacio: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  ],
  loft: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
  ],
  moradia: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8b3e7f82eb?auto=format&fit=crop&w=1600&q=80",
  ],
  ribeira: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  ],
  terreno: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  ],
  comercial: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
  ],
};

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("O seed de demonstração não corre em produção.");
  }

  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const passwordHash = await hash("demo1234", 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: "Atlântica Residências",
      logoUrl: null,
      brandColor: "#1F6B4A",
      phone: "+351 21 000 0000",
    },
  });

  const maria = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: "Maria Costa",
      email: "maria@atlantica.pt",
      phone: "351910000001",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const joao = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: "João Ferreira",
      email: "joao@atlantica.pt",
      phone: "351910000002",
      passwordHash,
      role: Role.AGENT,
    },
  });

  const ana = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: "Ana Ribeiro",
      email: "ana@atlantica.pt",
      phone: "351910000003",
      passwordHash,
      role: Role.AGENT,
    },
  });

  const t1 = await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: joao.id,
      title: "Apartamento com vista para o Tejo",
      description:
        "T3 luminoso na Estrela, com varanda contínua e cozinha equipada. Prédio reabilitado, elevador e lugar de garagem.",
      price: 685000,
      status: PropertyStatus.PUBLISHED,
      type: "Apartamento",
      address: "Rua de São Jorge 18",
      city: "Lisboa",
      bedrooms: 3,
      bathrooms: 2,
      area: 142,
      latitude: 38.7136,
      longitude: -9.1602,
      images: photos.palacio,
    },
  });

  await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: ana.id,
      title: "Loft no Príncipe Real",
      description:
        "Open space com pé-direito duplo, mezanine para escritório e terraço partilhado no último piso.",
      price: 495000,
      status: PropertyStatus.PUBLISHED,
      type: "Apartamento",
      address: "Rua da Escola Politécnica 42",
      city: "Lisboa",
      bedrooms: 1,
      bathrooms: 1,
      area: 88,
      latitude: 38.7169,
      longitude: -9.1488,
      images: photos.loft,
    },
  });

  await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: joao.id,
      title: "Moradia com jardim em Cascais",
      description:
        "V4 com piscina, anexo de hóspedes e orientação poente. A 8 minutos a pé da praia do Tamariz.",
      price: 1280000,
      status: PropertyStatus.PUBLISHED,
      type: "Moradia",
      address: "Avenida Emídio Navarro 7",
      city: "Cascais",
      bedrooms: 4,
      bathrooms: 3,
      area: 268,
      latitude: 38.6979,
      longitude: -9.4215,
      images: photos.moradia,
    },
  });

  await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: ana.id,
      title: "T2 na Ribeira do Porto",
      description:
        "Apartamento recuperado com vista para o Douro, tectos originais e arrumos no rés-do-chão.",
      price: 375000,
      status: PropertyStatus.PUBLISHED,
      type: "Apartamento",
      address: "Rua da Fonte Taurina 11",
      city: "Porto",
      bedrooms: 2,
      bathrooms: 1,
      area: 76,
      latitude: 41.1406,
      longitude: -8.6118,
      images: photos.ribeira,
    },
  });

  await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: joao.id,
      title: "Terreno para moradia em Sintra",
      description:
        "Lote de 620 m² com projecto aprovado para V3. Infra-estruturas no limite e vista serra.",
      price: 210000,
      status: PropertyStatus.PUBLISHED,
      type: "Terreno",
      address: "Estrada da Gandarinha",
      city: "Sintra",
      bedrooms: 0,
      bathrooms: 0,
      area: 620,
      latitude: 38.7974,
      longitude: -9.388,
      images: photos.terreno,
    },
  });

  await prisma.property.create({
    data: {
      tenantId: tenant.id,
      agentId: maria.id,
      title: "Loja na Baixa com cave",
      description:
        "Espaço comercial com montra dupla, cave para stock e licença de restauração em análise.",
      price: 320000,
      status: PropertyStatus.PENDING,
      type: "Comercial",
      address: "Rua Augusta 201",
      city: "Lisboa",
      bedrooms: 0,
      bathrooms: 1,
      area: 94,
      latitude: 38.711,
      longitude: -9.1367,
      images: photos.comercial,
    },
  });

  await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      propertyId: t1.id,
      agentId: joao.id,
      name: "Helena Martins",
      phone: "351930000111",
      message: "Gostaria de visitar ao fim-de-semana. O lugar de garagem está incluído?",
    },
  });

  console.log("Seed concluído.");
  console.log("Admin:  maria@atlantica.pt / demo1234");
  console.log("Agente: joao@atlantica.pt / demo1234");
  console.log("Site: http://localhost:3000");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
