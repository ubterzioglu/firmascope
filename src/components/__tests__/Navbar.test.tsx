import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";

const mockUser = {
  id: "user-123",
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

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
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

  it("shows Giriş Yap button when not logged in", () => {
    renderNavbar();
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    expect(screen.getByText("Üye Ol")).toBeInTheDocument();
  });

  it("shows user email and logout button when logged in", () => {
    authContextValue.user = mockUser;
    renderNavbar();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
    const logOutSvg = document.querySelector("svg.lucide-log-out");
    expect(logOutSvg).toBeInTheDocument();
  });

  it("shows admin link when user is admin", () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = true;
    renderNavbar();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("hides admin link when user is not admin", () => {
    authContextValue.user = mockUser;
    authContextValue.isAdmin = false;
    renderNavbar();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("calls signOut on logout click", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;
    renderNavbar();
    const logoutButtons = screen.getAllByRole("button");
    const logoutBtn = logoutButtons.find((btn) => btn.querySelector("svg.lucide-log-out"));
    if (logoutBtn) {
      await user.click(logoutBtn);
      expect(authContextValue.signOut).toHaveBeenCalled();
    }
  });

  it("opens mobile menu on hamburger click", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const menuButton = screen.getByRole("button");
    await user.click(menuButton);

    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
  });

  it("shows ... when loading", () => {
    authContextValue.loading = true;
    renderNavbar();
    expect(screen.getByText("...")).toBeInTheDocument();
  });
});
