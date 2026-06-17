/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminAnnouncements from "@/components/AdminAnnouncements";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminUsers from "@/pages/admin/AdminUsers";

const mockUser = {
  id: "admin-123",
  email: "ubterzioglu@gmail.com",
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

const mockState = vi.hoisted(() => ({
  tableData: {} as Record<string, any[]>,
  rpcMock: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => authContextValue,
  AuthProvider: ({ children }: { children: any }) => <>{children}</>,
}));

vi.mock("@/integrations/supabase/client", () => {
  const createChain = (table: string) => {
    const chain: any = {};
    const responseForTable = () => ({ data: mockState.tableData[table] ?? [], error: null });
    const mk = () => vi.fn().mockReturnValue(chain);

    chain.select = mk();
    chain.insert = mk();
    chain.update = mk();
    chain.delete = mk();
    chain.eq = mk();
    chain.neq = mk();
    chain.order = mk();
    chain.limit = mk();
    chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
    chain.then = vi.fn((onFulfilled: (value: any) => any) =>
      Promise.resolve(responseForTable()).then(onFulfilled)
    );

    return chain;
  };

  return {
    supabase: {
      auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() },
      rpc: mockState.rpcMock,
      from: vi.fn().mockImplementation((table: string) => createChain(table)),
      storage: { from: vi.fn() },
    },
  };
});

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children: any }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: any }) => <>{children}</>,
}));

// Mounts the new nested-route admin shell. `initialPath` selects the child route,
// replacing the old click-to-switch tab interaction.
function renderAdmin(initialPath = "/admin") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAnnouncements />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/giris" element={<div>Login Page</div>} />
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
    mockState.tableData = {
      company_suggestions: [],
      company_claims: [],
      companies: [
        {
          id: "comp-1",
          name: "Firmascope",
          slug: "firmascope",
          sector: "Teknoloji",
          city: "Istanbul",
          company_type: "A.S.",
          status: "Aktif",
          provenance_tag: "before",
          created_via: "legacy_import",
          created_by_admin_user_id: null,
        },
      ],
      profiles: [
        {
          id: "profile-1",
          user_id: "admin-123",
          display_name: "Ana Admin",
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "profile-2",
          user_id: "user-456",
          display_name: "Editor User",
          created_at: "2024-02-01T00:00:00Z",
        },
      ],
      user_roles: [
        { user_id: "admin-123", role: "admin" },
      ],
      reviews: [],
      salaries: [],
      interviews: [],
    };
    mockState.rpcMock.mockResolvedValue({ data: null, error: null });
  });

  it("redirects to login when not logged in", async () => {
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
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

  it("renders admin panel shell for admin users", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText("Yönetim Paneli")).toBeInTheDocument();
    });
  });

  it("shows loading state while auth is loading", () => {
    authContextValue.loading = true;
    renderAdmin();
    expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
  });

  it("shows provenance badges in companies route", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderAdmin("/admin/companies");

    expect(await screen.findByText("Legacy Import")).toBeInTheDocument();
    expect(screen.getByText("Before")).toBeInTheDocument();
  });

  it("shows sql upload tools and admin import guidance in companies route", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderAdmin("/admin/companies");

    expect(await screen.findByText("SQL Dosyasi Yukle")).toBeInTheDocument();
    expect(screen.getByText("Calisma Notu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SQL Dosyasini Calistir" })).toBeInTheDocument();
    expect(screen.getByText(/300 sirket senin tarafindan 100-100-100 paylastirilacak/i)).toBeInTheDocument();
  });

  it("shows admin role controls in users route", async () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderAdmin("/admin/users");

    expect(await screen.findByText("Ana Admin")).toBeInTheDocument();
    expect(screen.getByText("Editor User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Admin Yap" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Admin Kaldir" })).toBeInTheDocument();
  });

  it("hides admin role controls for non-super-admin accounts", async () => {
    authContextValue.user = { ...mockUser, email: "admin@example.com" };
    authContextValue.isAdmin = true;
    renderAdmin("/admin/users");

    expect(await screen.findAllByText("Sadece super admin")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Admin Yap" })).not.toBeInTheDocument();
  });
});
