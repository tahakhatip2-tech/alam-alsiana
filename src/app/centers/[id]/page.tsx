import CenterDetailsClient from "./CenterDetailsClient";
import { INITIAL_MAINTENANCE_CENTERS } from "@/lib/centers-data";

export function generateStaticParams() {
  return INITIAL_MAINTENANCE_CENTERS.map((c) => ({
    id: c.id,
  }));
}

export default async function CenterDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CenterDetailsClient centerId={id} />;
}
