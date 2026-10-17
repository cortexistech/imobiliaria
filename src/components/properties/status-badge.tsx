import { STATUS_LABEL } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { PropertyStatus } from "@/generated/prisma/enums";

const tone: Record<PropertyStatus, "mist" | "survey" | "field"> = {
  DRAFT: "mist",
  PENDING: "survey",
  PUBLISHED: "field",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge tone={tone[status]}>{STATUS_LABEL[status]}</Badge>;
}
