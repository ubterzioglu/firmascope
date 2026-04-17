import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
} as any;

const mockSession = {
  access_token: "token-123",
  refresh_token: "refresh-123",
  user: mockUser,
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 1735689600,
} as any;

let onAuthStateChangeCallback: ((event: string, session: any) => void) | null = null;
const mockSubscription = { unsubscribe: vi.fn() };

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn().mockImplementation((cb: any) => {
        onAuthStateChangeCallback = cb;
        return { data: { subscription: mockSubscription } };
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resend: vi.fn(),
    },
    rpc: vi.fn(),
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

import { supabase } from "@/integrations/supabase/client";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChangeCallback = null;
  });

  it("starts with loading=true and updates after getSession resolves", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it("sets user and session from getSession when session exists", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    });
    vi.mocked(supabase.rpc).mockResolvedValue({ data: false });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
  });

  it("calls is_admin RPC and sets isAdmin=true when admin", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    });
    vi.mocked(supabase.rpc).mockResolvedValue({ data: true });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    expect(supabase.rpc).toHaveBeenCalledWith("is_admin", {
      _user_id: mockUser.id,
    });
  });

  it("calls is_admin RPC and keeps isAdmin=false when not admin", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    });
    vi.mocked(supabase.rpc).mockResolvedValue({ data: false });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it("updates state via onAuthStateChange callback", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.mocked(supabase.rpc).mockResolvedValue({ data: false });

    act(() => {
      onAuthStateChangeCallback!("SIGNED_IN", mockSession);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    }, { timeout: 5000 });
    expect(result.current.session).toEqual(mockSession);
  });

  it("sets isAdmin=false when onAuthStateChange fires with no session", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    });
    vi.mocked(supabase.rpc).mockResolvedValue({ data: true });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    act(() => {
      onAuthStateChangeCallback!("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  it("signOut resets user, session, and isAdmin", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    });
    vi.mocked(supabase.rpc).mockResolvedValue({ data: true });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it("unsubscribes on unmount", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    });

    const { unmount } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    unmount();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
