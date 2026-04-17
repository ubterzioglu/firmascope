import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
} as any;

let authContextValue: any = {
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: vi.fn().mockResolvedValue(undefined),
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => authContextValue,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { signOut: vi.fn() },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

import { supabase } from "@/integrations/supabase/client";
import { useSalaryGate } from "@/hooks/useSalaryGate";

describe("useSalaryGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authContextValue = {
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      signOut: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("returns isGated=true when not logged in", async () => {
    const { result } = renderHook(() => useSalaryGate());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.hasSubmitted).toBe(false);
    expect(result.current.isGated).toBe(true);
  });

  it("returns hasSubmitted=true when user has submitted salary", async () => {
    authContextValue.user = mockUser;
    vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null });

    const { result } = renderHook(() => useSalaryGate());

    await waitFor(() => {
      expect(result.current.hasSubmitted).toBe(true);
    });

    expect(result.current.isGated).toBe(false);
    expect(result.current.checking).toBe(false);
  });

  it("returns hasSubmitted=false when user has not submitted salary", async () => {
    authContextValue.user = mockUser;
    vi.mocked(supabase.rpc).mockResolvedValue({ data: false, error: null });

    const { result } = renderHook(() => useSalaryGate());

    await waitFor(() => {
      expect(result.current.hasSubmitted).toBe(false);
    });

    expect(result.current.isGated).toBe(true);
  });

  it("handles RPC error gracefully", async () => {
    authContextValue.user = mockUser;
    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const { result } = renderHook(() => useSalaryGate());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.hasSubmitted).toBe(false);
    expect(result.current.isGated).toBe(true);
  });

  it("calls has_submitted_salary RPC with correct user id", async () => {
    authContextValue.user = mockUser;
    vi.mocked(supabase.rpc).mockResolvedValue({ data: false, error: null });

    renderHook(() => useSalaryGate());

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith("has_submitted_salary", {
        p_user_id: mockUser.id,
      });
    });
  });
});
