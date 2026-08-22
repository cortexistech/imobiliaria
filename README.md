# Atlântica Residências

Site da imobiliária: cadastro de imóveis no terreno, vitrine pública e pedidos de visita no WhatsApp do corretor.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Prisma** + SQLite local (PostgreSQL em produção)
- **Auth.js** com cargos `ADMIN` (gestão) e `AGENT` (corretor)
- **Leaflet / OpenStreetMap**
- Upload local ou **Cloudinary**
- Notificações **WhatsApp** (opcional)

## Arranque local

```bash
cd ImobiFlow
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Contas da equipa (só em desenvolvimento)

| Papel    | Email                 | Palavra-passe |
|----------|-----------------------|---------------|
| Gestão   | maria@atlantica.pt    | demo1234      |
| Corretor | joao@atlantica.pt     | demo1234      |

Painel interno: [/dashboard](http://localhost:3000/dashboard)

## Variáveis de ambiente

| Variável | Função |
|----------|--------|
| `DATABASE_URL` | `file:./dev.db` local, ou URL PostgreSQL em produção |
| `AUTH_SECRET` | Segredo JWT (`openssl rand -base64 32`) |
| `AUTH_URL` | URL pública do site |
| `WHATSAPP_API_URL` / `WHATSAPP_API_KEY` | Disparo de leads (se vazio, o pedido fica gravado e o envio corre em simulação) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_UPLOAD_PRESET` | Fotografias na CDN; senão grava em `/public/uploads` |
# ImobiFlow
