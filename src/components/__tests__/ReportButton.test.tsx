import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ReportButton from "@/components/ReportButton";

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
    chain.update = mk();
    chain.delete = mk();
    chain.eq = mk();
    chain.order = mk();
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

function renderReportButton() {
  return render(
    <MemoryRouter>
      <ReportButton targetId="review-1" targetType="review" />
    </MemoryRouter>
  );
}

describe("ReportButton", () => {
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

  it("shows 'Giriş yapın' toast when unauthenticated user clicks report", async () => {
    const user = userEvent.setup();
    renderReportButton();
    const reportBtn = screen.getByTitle("İçeriği bildir");
    await user.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText("Giriş yapın")).toBeInTheDocument();
    });
  });

  it("opens dialog when authenticated user clicks report", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;
    renderReportButton();

    const reportBtn = screen.getByTitle("İçeriği bildir");
    await user.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText("İçeriği Bildir")).toBeInTheDocument();
    });
  });

  it("submit button is disabled when no reason selected", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;
    renderReportButton();

    const reportBtn = screen.getByTitle("İçeriği bildir");
    await user.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText("İçeriği Bildir")).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /bildir/i });
    expect(submitBtn).toBeDisabled();
  });

  it("submits report with valid reason", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const chainMock = createChainableMock({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderReportButton();

    const reportBtn = screen.getByTitle("İçeriği bildir");
    await user.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText("İçeriği Bildir")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Spam veya reklam"));
    const submitBtn = screen.getByRole("button", { name: /bildir/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("İçerik raporunuz alındı. Teşekkürler!")).toBeInTheDocument();
    });
  });

  it("shows rate limit error", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const chainMock = createChainableMock({ data: null, error: { message: "rate_limit exceeded 5 gönderi" } });
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderReportButton();

    const reportBtn = screen.getByTitle("İçeriği bildir");
    await user.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText("İçeriği Bildir")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Spam veya reklam"));
    const submitBtn = screen.getByRole("button", { name: /bildir/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Limit aşıldı")).toBeInTheDocument();
    });
  });
});
