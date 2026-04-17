import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SuggestCompany from "@/pages/SuggestCompany";

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

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children: any }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: any }) => <>{children}</>,
}));

vi.mock("@/components/Layout", () => ({
  __esModule: true,
  default: ({ children }: { children: any }) => <div>{children}</div>,
}));

vi.mock("@/components/Breadcrumb", () => ({
  __esModule: true,
  default: () => <nav>Breadcrumb</nav>,
}));

import { supabase } from "@/integrations/supabase/client";

function renderSuggestCompany() {
  return render(
    <MemoryRouter initialEntries={["/sirket-oner"]}>
      <Routes>
        <Route path="/sirket-oner" element={<SuggestCompany />} />
        <Route path="/giris" element={<div>Login Page</div>} />
        <Route path="/sirketler" element={<div>Companies Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("SuggestCompany Page", () => {
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

  it("redirects to /giris when not logged in", () => {
    renderSuggestCompany();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders form when logged in", () => {
    authContextValue.user = mockUser;
    renderSuggestCompany();
    expect(screen.getByText("Şirket Öner")).toBeInTheDocument();
    expect(screen.getByLabelText(/şirket adı/i)).toBeInTheDocument();
  });

  it("shows error when company name is empty", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;
    renderSuggestCompany();

    const submitBtn = screen.getByRole("button", { name: /öneriyi gönder/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Şirket adı zorunludur.")).toBeInTheDocument();
    });
  });

  it("submits form successfully", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const chainMock = createChainableMock({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderSuggestCompany();

    await user.type(screen.getByLabelText(/şirket adı/i), "Test Şirketi");
    await user.click(screen.getByRole("button", { name: /öneriyi gönder/i }));

    await waitFor(() => {
      expect(screen.getByText("Şirket öneriniz incelemeye gönderildi.")).toBeInTheDocument();
    });
  });

  it("shows error on supabase failure", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;

    const chainMock = createChainableMock({ data: null, error: { message: "Insert failed" } });
    vi.mocked(supabase.from).mockReturnValue(chainMock);

    renderSuggestCompany();

    await user.type(screen.getByLabelText(/şirket adı/i), "Test Şirketi");
    await user.click(screen.getByRole("button", { name: /öneriyi gönder/i }));

    await waitFor(() => {
      expect(screen.getByText("Öneri gönderilemedi. Tekrar deneyin.")).toBeInTheDocument();
    });
  });
});
