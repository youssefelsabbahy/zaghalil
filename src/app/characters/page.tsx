import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { CharactersPage } from "@/components/pages/CharactersPage";
import { charactersPage } from "@/content/site";

export const metadata: Metadata = pageMeta({ title: charactersPage.crumb, description: charactersPage.intro, path: "/characters", image: "/og/characters.png" });

export default function Page() {
  return <CharactersPage />;
}
