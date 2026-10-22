import type { Metadata } from "next";
import { MenuBrowser, type Filter } from "@/components/menu/MenuBrowser";

export const metadata: Metadata = { title: "منو" };

const valid: Filter[] = ["all", "special", "coffee", "cold", "dessert", "food"];

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const initial = valid.includes(cat as Filter) ? (cat as Filter) : "all";
  return <MenuBrowser initial={initial} />;
}
