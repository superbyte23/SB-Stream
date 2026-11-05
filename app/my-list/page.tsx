import type { Metadata } from "next";
import { MyListView } from "@/components/my-list-view";

export const metadata: Metadata = {
  title: "My List",
  description: "Your saved movies and TV shows on SBS.",
  robots: { index: false, follow: true },
};

export default function MyListPage() {
  return <MyListView />;
}
