import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Give-to-get salary gating hook.
 * Returns whether the current user has submitted at least one salary entry.
 * If they haven't, salary details should be blurred/gated.
 */
export const useSalaryGate = () => {
  const { user } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setHasSubmitted(false);
        setChecking(false);
        return;
      }

      const { data, error } = await supabase.rpc("has_submitted_salary", {
        p_user_id: user.id,
      });

      if (!error) {
        setHasSubmitted(!!data);
      }
      setChecking(false);
    };

    check();
  }, [user]);

  return { hasSubmitted, checking, isGated: !hasSubmitted };
};
