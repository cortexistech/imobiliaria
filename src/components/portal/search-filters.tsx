"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROPERTY_TYPES } from "@/lib/constants";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SearchFilters({
  current,
}: {
  current: {
    type?: string;
    city?: string;
    min?: string;
    max?: string;
    rooms?: string;
  };
}) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    type: current.type ?? "",
    city: current.city ?? "",
    min: current.min ?? "",
    max: current.max ?? "",
    rooms: current.rooms ?? "",
  });

  function apply(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <form
      onSubmit={apply}
      className="grid gap-3  border border-ink/10 bg-white p-4 md:grid-cols-6"
    >
      <Field label="Tipo">
        <Select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Todos</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
      </Field>
      <Field label="Cidade">
        <Input
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="Lisboa"
        />
      </Field>
      <Field label="Preço min.">
        <Input
          type="number"
          value={filters.min}
          onChange={(e) => setFilters({ ...filters, min: e.target.value })}
        />
      </Field>
      <Field label="Preço máx.">
        <Input
          type="number"
          value={filters.max}
          onChange={(e) => setFilters({ ...filters, max: e.target.value })}
        />
      </Field>
      <Field label="Quartos">
        <Input
          type="number"
          min={0}
          value={filters.rooms}
          onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
        />
      </Field>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
