import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import VoteButtons from "@/components/VoteButtons";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
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
  AuthProvider: ({ children }: { children: any }) => <>{children}</>,
}));

const { createChainableMock } = vi.hoisted(() => {
  const createChainableMock = (resolvedValue: any = { data: [], error: null }) => {
    const chain: any = {};
    const mk = () => vi.fn().mockReturnValue(chain);
    chain.select = mk();
    chain.insert = mk().mockResolvedValue(resolvedValue);
    chain.update = mk().mockResolvedValue(resolvedValue);
    chain.delete = mk().mockResolvedValue(resolvedValue);
    chain.eq = mk();
    chain.order = mk();
    chain.then = vi.fn((cb: any) => cb(resolvedValue));
    return chain;
  };
  return { createChainableMock };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() },
    rpc: vi.fn(),
    from: vi.fn().mockReturnValue(createChainableMock()),
    storage: { from: vi.fn() },
  },
}));

import { supabase } from "@/integrations/supabase/client";

function renderVoteButtons() {
  return render(
    <MemoryRouter>
      <VoteButtons targetId="review-1" targetType="review" />
    </MemoryRouter>
  );
}

describe("VoteButtons", () => {
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

  it("shows 'Giriş yapın' toast when unauthenticated user votes", async () => {
    const user = userEvent.setup();
    renderVoteButtons();
    const upvoteBtn = screen.getByTitle("Faydalı");
    await user.click(upvoteBtn);

    await waitFor(() => {
      expect(screen.getByText("Giriş yapın")).toBeInTheDocument();
    });
  });

  it("inserts new vote when authenticated user votes", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const chainMock = createChainableMock({ data: [], error: null });
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null });
    chainMock.insert = insertMock;
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderVoteButtons();
    const upvoteBtn = screen.getByTitle("Faydalı");
    await user.click(upvoteBtn);

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUser.id,
          target_id: "review-1",
          target_type: "review",
          vote_type: 1,
        })
      );
    });
  });

  it("deletes vote on toggle (same vote again)", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const existingVotes = [{ vote_type: 1, user_id: mockUser.id }];
    const chainMock = createChainableMock({ data: existingVotes, error: null });
    const deleteMock = vi.fn().mockResolvedValue({ data: null, error: null });
    chainMock.delete = deleteMock;
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderVoteButtons();
    const upvoteBtn = screen.getByTitle("Faydalı");
    await user.click(upvoteBtn);

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalled();
    });
  });

  it("renders vote counts correctly", async () => {
    const existingVotes = [
      { vote_type: 1, user_id: "user-a" },
      { vote_type: 1, user_id: "user-b" },
      { vote_type: -1, user_id: "user-c" },
    ];
    vi.mocked(supabase.from).mockReturnValue(createChainableMock({ data: existingVotes, error: null }));

    renderVoteButtons();
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });
});
