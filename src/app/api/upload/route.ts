import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import { isSameOriginRequest } from "@/lib/origin";
import { MAX_BYTES, MAX_FILES, sniffImage } from "@/lib/image-type";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.tenantId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Origem não permitida" }, { status: 403 });
  }

  const form = await req.formData();
  const files = form
    .getAll("files")
    .filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Nenhum ficheiro enviado" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "Demasiados ficheiros de uma vez" }, { status: 400 });
  }

  const sniffed: Array<{ file: File; buffer: Buffer; ext: string; mime: string }> = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ficheiro demasiado grande (máx. 8 MB)" }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = sniffImage(buffer);
    if (!kind) {
      return NextResponse.json(
        { error: "Só são aceites imagens JPEG, PNG, GIF ou WebP" },
        { status: 400 },
      );
    }
    sniffed.push({ file, buffer, ext: kind.ext, mime: kind.mime });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const urls: string[] = [];

  if (cloudName && uploadPreset) {
    for (const item of sniffed) {
      const payload = new FormData();
      payload.append(
        "file",
        new Blob([new Uint8Array(item.buffer)], { type: item.mime }),
        `upload${item.ext}`,
      );
      payload.append("upload_preset", uploadPreset);
      payload.append("folder", `imobiflow/${session.user.tenantId}`);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: payload },
      );
      if (!response.ok) {
        return NextResponse.json(
          { error: "Falha no envio para Cloudinary" },
          { status: 502 },
        );
      }
      const data = (await response.json()) as { secure_url?: string };
      if (data.secure_url) urls.push(data.secure_url);
    }
    return NextResponse.json({ urls });
  }

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    session.user.tenantId,
  );
  await mkdir(dir, { recursive: true });

  for (const item of sniffed) {
    const filename = `${crypto.randomUUID()}${item.ext}`;
    await writeFile(path.join(dir, filename), item.buffer);
    urls.push(`/uploads/${session.user.tenantId}/${filename}`);
  }

  return NextResponse.json({ urls });
}
