"use client";
import { useArticles } from "@/hooks/useArticles";
import { useSupabase } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";

export type Article = {
  id: number;
  created_at?: string;
  title: string;
  votes?: any[];
};

export default function ArticleItem({
  article: { id, title, votes },
}: {
  article: Article;
}) {
  const { user, getCurrentUser } = useSupabase();
  const { newVote } = useArticles();

  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      const { id } = user;
      const findVote = votes?.find((v) => v.user_id === id);
      if (findVote) setHasVoted(true);
    }
  }, [user]);

  return (
    <div
      className="border flex items-center justify-between p-8 cursor-pointer hover:bg-gray-900"
      onClick={() => newVote(id)}
    >
      <h1>{title}</h1>
      <div className={`grid ${hasVoted ? "border-purple" : "border-white"}`}>
        <span>{votes?.length} votes</span>
      </div>
    </div>
  );
}
