"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PropertyStatus } from "@prisma/client";
import { ImagePlus, Trash2 } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import { saveProperty } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { LocationPicker } from "@/components/map/location-picker";
import { cn } from "@/lib/utils";

const STEPS = ["Essencial", "No terreno", "Números", "Fotografias"] as const;

export type PropertyFormValue = {
  title: string;
  description: string;
  type: (typeof PROPERTY_TYPES)[number];
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
  status: PropertyStatus;
};

const empty: PropertyFormValue = {
  title: "",
  description: "",
  type: "Apartamento",
  price: 0,
  address: "",
  city: "",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  latitude: DEFAULT_MAP_CENTER.lat,
  longitude: DEFAULT_MAP_CENTER.lng,
  images: [],
  status: PropertyStatus.PENDING,
};

export function PropertyWizard({
  propertyId,
  initial,
  isAdmin,
}: {
  propertyId?: string;
  initial?: Partial<PropertyFormValue>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState<PropertyFormValue>({ ...empty, ...initial });

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function patch(partial: Partial<PropertyFormValue>) {
    setValue((current) => ({ ...current, ...partial }));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));
    const response = await fetch("/api/upload", { method: "POST", body: data });
    const json = (await response.json()) as { urls?: string[]; error?: string };
    setUploading(false);
    if (!response.ok) {
      setError(json.error || "Falha no envio das fotografias.");
      return;
    }
    patch({ images: [...value.images, ...(json.urls ?? [])] });
  }

  function submit(status: PropertyStatus) {
    setError(null);
    startTransition(async () => {
      const result = await saveProperty(propertyId ?? null, { ...value, status });
      if (result && "error" in result && result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
            Passo {step + 1} / {STEPS.length}
          </p>
          <h1 className="font-display text-3xl font-semibold">{STEPS[step]}</h1>
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-mist">
          <div className="h-full bg-survey" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 0 ? (
        <div className="grid gap-4">
          <Field label="Título do anúncio">
            <Input
              value={value.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="T3 com varanda na Estrela"
            />
          </Field>
          <Field label="Tipologia">
            <Select
              value={value.type}
              onChange={(e) =>
                patch({ type: e.target.value as PropertyFormValue["type"] })
              }
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </Field>
          <Field label="Descrição" hint="O que o cliente precisa de saber no terreno.">
            <Textarea
              value={value.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Morada">
              <Input
                value={value.address}
                onChange={(e) => patch({ address: e.target.value })}
              />
            </Field>
            <Field label="Cidade">
              <Input
                value={value.city}
                onChange={(e) => patch({ city: e.target.value })}
              />
            </Field>
          </div>
          <LocationPicker
            lat={value.latitude}
            lng={value.longitude}
            onChange={(latitude, longitude) => patch({ latitude, longitude })}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preço (€)">
            <Input
              type="number"
              min={0}
              value={value.price || ""}
              onChange={(e) => patch({ price: Number(e.target.value) })}
            />
          </Field>
          <Field label="Área (m²)">
            <Input
              type="number"
              min={0}
              value={value.area || ""}
              onChange={(e) => patch({ area: Number(e.target.value) })}
            />
          </Field>
          <Field label="Quartos">
            <Input
              type="number"
              min={0}
              value={value.bedrooms}
              onChange={(e) => patch({ bedrooms: Number(e.target.value) })}
            />
          </Field>
          <Field label="Casas de banho">
            <Input
              type="number"
              min={0}
              value={value.bathrooms}
              onChange={(e) => patch({ bathrooms: Number(e.target.value) })}
            />
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4">
          <label className="grid cursor-pointer place-items-center gap-2  border border-dashed border-ink/20 bg-white px-4 py-10 text-center">
            <ImagePlus className="h-6 w-6 text-field" />
            <span className="text-sm font-semibold">
              {uploading ? "A optimizar fotografias…" : "Adicionar fotografias"}
            </span>
            <span className="text-xs text-slate">
              JPEG ou PNG. Compressão WebP no Cloudinary, quando configurado.
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {value.images.map((src) => (
              <div key={src} className="group relative overflow-hidden ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    patch({ images: value.images.filter((item) => item !== src) })
                  }
                  className="absolute right-2 top-2 rounded-full bg-ink/80 p-1 text-white opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-lead">{error}</p> : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
        >
          Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>
              Continuar
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => submit(PropertyStatus.DRAFT)}
              >
                Guardar rascunho
              </Button>
              <Button
                type="button"
                disabled={pending}
                onClick={() =>
                  submit(isAdmin ? PropertyStatus.PUBLISHED : PropertyStatus.PENDING)
                }
                className={cn(pending && "opacity-70")}
              >
                {isAdmin ? "Publicar na vitrine" : "Enviar para aprovação"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
