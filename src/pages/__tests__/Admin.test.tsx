import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Admin from "@/pages/Admin";

const mockUser = {
  id: "admin-123",
  email: "admin@example.com",
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

vi.mock("@/integrations/supabase/client", () => {
  const createChain = () => {
    const chain: any = {};
    const mk = () => vi.fn().mockReturnValue(chain);
    chain.select = mk(); chain.insert = mk(); chain.update = mk(); chain.delete = mk();
    chain.eq = mk(); chain.neq = mk(); chain.order = mk(); chain.limit = mk();
    chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
    chain.then = vi.fn((cb: any) => cb({ data: [], error: null }));
    return chain;
  };
  return {
    supabase: {
      auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() },
      rpc: vi.fn().mockResolvedValue({ data: [] }),
      from: vi.fn().mockImplementation(() => createChain()),
      storage: { from: vi.fn() },
    },
  };
});

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children: any }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: any }) => <>{children}</>,
}));

function renderAdmin() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Admin Page Authorization", () => {
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

  it("redirects to home when not logged in", async () => {
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("redirects to home when logged in but not admin", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = false;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("renders admin panel for admin users", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText("Yönetim Paneli")).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it("shows loading state while auth is loading", () => {
    authContextValue.loading = true;
    renderAdmin();
    expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
  });
});
