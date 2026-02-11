import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface VoteButtonsProps {
  targetId: string;
  targetType: "review" | "salary" | "interview";
}

interface VoteCounts {
  up: number;
  down: number;
}

const VoteButtons = ({ targetId, targetType }: VoteButtonsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [counts, setCounts] = useState<VoteCounts>({ up: 0, down: 0 });
  const [myVote, setMyVote] = useState<1 | -1 | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVotes = useCallback(async () => {
    const { data } = await supabase
      .from("votes")
      .select("vote_type, user_id")
      .eq("target_id", targetId)
      .eq("target_type", targetType);

    if (data) {
      const up = data.filter((v) => v.vote_type === 1).length;
      const down = data.filter((v) => v.vote_type === -1).length;
      setCounts({ up, down });

      if (user) {
        const mine = data.find((v) => v.user_id === user.id);
        setMyVote(mine ? (mine.vote_type as 1 | -1) : null);
      }
    }
  }, [targetId, targetType, user]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const handleVote = async (voteType: 1 | -1) => {
    if (!user) {
      toast({
        title: "Giriş yapın",
        description: "Oy vermek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (myVote === voteType) {
        // Remove vote (toggle off)
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("target_id", targetId)
          .eq("target_type", targetType);

        if (error) throw error;

        setMyVote(null);
        setCounts((prev) => ({
          ...prev,
          [voteType === 1 ? "up" : "down"]: prev[voteType === 1 ? "up" : "down"] - 1,
        }));
      } else if (myVote !== null) {
        // Change vote
        const { error } = await supabase
          .from("votes")
          .update({ vote_type: voteType })
          .eq("user_id", user.id)
          .eq("target_id", targetId)
          .eq("target_type", targetType);

        if (error) throw error;

        const oldKey = myVote === 1 ? "up" : "down";
        const newKey = voteType === 1 ? "up" : "down";
        setMyVote(voteType);
        setCounts((prev) => ({
          ...prev,
          [oldKey]: prev[oldKey] - 1,
          [newKey]: prev[newKey] + 1,
        }));
      } else {
        // New vote
        const { error } = await supabase.from("votes").insert({
          user_id: user.id,
          target_id: targetId,
          target_type: targetType,
          vote_type: voteType,
        });

        if (error) throw error;

        setMyVote(voteType);
        setCounts((prev) => ({
          ...prev,
          [voteType === 1 ? "up" : "down"]: prev[voteType === 1 ? "up" : "down"] + 1,
        }));
      }
    } catch {
      toast({
        title: "Hata",
        description: "Oy verilemedi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = counts.up + counts.down;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
          myVote === 1
            ? "bg-alm-green/20 text-alm-green"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Faydalı"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        {counts.up > 0 && <span className="font-medium">{counts.up}</span>}
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
          myVote === -1
            ? "bg-alm-red/20 text-alm-red"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Faydasız"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        {counts.down > 0 && <span className="font-medium">{counts.down}</span>}
      </button>
      {total > 0 && (
        <span className="ml-1 text-[10px] text-muted-foreground/60">
          %{Math.round((counts.up / total) * 100)} faydalı
        </span>
      )}
    </div>
  );
};

export default VoteButtons;
