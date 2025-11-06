// /src/lib/hotTopicService.ts
import { supabase } from "./supabaseClient";

export async function getActiveHotTopics() {
  const { data, error } = await supabase.from("hot_topics_view").select("*");
  if (error) {
    console.error("❌ Gagal mengambil hot topics:", error.message);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    img: item.img,
    link: item.category
  ? `/bimbel?tab=${item.category.toLowerCase()}`
  : "/bimbel",
  }));
}
