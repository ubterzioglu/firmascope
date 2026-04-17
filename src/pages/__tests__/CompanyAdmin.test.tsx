import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CompanyAdmin from "@/pages/CompanyAdmin";

const mockUser = {
  id: "company-admin-123",
  email: "companyadmin@example.com",
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
    chain.insert = mk();
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
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    from: vi.fn().mockReturnValue(createChainableMock()),
    storage: { from: vi.fn() },
  },
}));

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children: any }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: any }) => <>{children}</>,
}));

import { supabase } from "@/integrations/supabase/client";

function renderCompanyAdmin() {
  return render(
    <MemoryRouter initialEntries={["/sirket-yonetimi"]}>
      <Routes>
        <Route path="/sirket-yonetimi" element={<CompanyAdmin />} />
        <Route path="/giris" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CompanyAdmin Page Authorization", () => {
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

  it("redirects to /giris when not logged in", async () => {
    renderCompanyAdmin();
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("shows not admin message when user has no company assignments", async () => {
    authContextValue.user = mockUser;
    vi.mocked(supabase.from).mockReturnValue(createChainableMock({ data: [], error: null }));

    renderCompanyAdmin();
    await waitFor(() => {
      expect(screen.getByText("Şirket Admini Değilsiniz")).toBeInTheDocument();
    });
  });

  it("renders company management panel when user has assignments", async () => {
    authContextValue.user = mockUser;
    const assignments = [
      { company_id: "comp-1", companies: { name: "Test Co", slug: "test-co", sector: "Teknoloji", city: "İstanbul" } },
    ];
    vi.mocked(supabase.from).mockReturnValue(createChainableMock({ data: assignments, error: null }));

    renderCompanyAdmin();
    await waitFor(() => {
      expect(screen.getByText("Şirket Yönetimi")).toBeInTheDocument();
    });
  });

  it("shows loading state while auth is loading", () => {
    authContextValue.loading = true;
    renderCompanyAdmin();
    expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
  });
});
