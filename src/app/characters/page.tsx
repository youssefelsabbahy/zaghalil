import type { Metadata } from "next";
import { CharactersPage } from "@/components/pages/CharactersPage";
import { charactersPage } from "@/content/site";

export const metadata: Metadata = { title: charactersPage.crumb, description: charactersPage.intro };

export default function Page() {
  return <CharactersPage />;
}
