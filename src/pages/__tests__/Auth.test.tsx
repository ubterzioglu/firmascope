import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import Auth from "@/pages/Auth";

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

let authContextValue: any = {
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: vi.fn().mockResolvedValue(undefined),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      resend: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    rpc: vi.fn(),
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => authContextValue,
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children: ReactNode }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/Layout", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

import { supabase } from "@/integrations/supabase/client";

function renderAuth(route = "/giris") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/giris" element={<Auth />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Auth Page", () => {
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

  describe("Render Tests", () => {
    it("shows login form by default", () => {
      renderAuth();
      expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
      expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
      expect(screen.getByText("Google ile devam et")).toBeInTheDocument();
    });

    it("switches to signup mode", async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.click(screen.getByText("Kayıt Ol"));
      expect(screen.getByText("Kayıt Ol")).toBeInTheDocument();
      expect(screen.getByText("Zaten hesabınız var mı?")).toBeInTheDocument();
    });

    it("redirects to home if user is already logged in", () => {
      authContextValue.user = mockUser;
      renderAuth();
      expect(screen.queryByText("Giriş Yap")).not.toBeInTheDocument();
    });
  });

  describe("Email/Password Login", () => {
    it("calls signInWithPassword with valid credentials", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "invalid-email");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      expect(screen.getByText("Geçerli bir e-posta adresi girin")).toBeInTheDocument();
    });

    it("shows validation error for short password", async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "12345");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      expect(screen.getByText("Şifre en az 6 karakter olmalıdır")).toBeInTheDocument();
    });

    it("shows error toast for wrong password", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "wrong123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("E-posta veya şifre hatalı.")).toBeInTheDocument();
      });
    });

    it("switches to resend mode on email not confirmed", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email not confirmed" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("E-posta Onayı")).toBeInTheDocument();
      });
    });

    it("shows generic error for unknown errors", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Some unknown error" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("Some unknown error")).toBeInTheDocument();
      });
    });

    it("disables submit button while loading", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 5000))
      );

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
      });
    });
  });

  describe("Signup", () => {
    it("calls signUp and shows success toast", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      renderAuth();
      await user.click(screen.getByText("Kayıt Ol"));
      await user.type(screen.getByLabelText(/e-posta/i), "new@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /kayıt ol/i }));

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
        options: { emailRedirectTo: "http://localhost:5173/" },
      });

      await waitFor(() => {
        expect(screen.getByText("E-postanızı kontrol edin ve hesabınızı onaylayın.")).toBeInTheDocument();
      });
    });

    it("shows error for already registered email", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "User already registered" } as any,
      });

      renderAuth();
      await user.click(screen.getByText("Kayıt Ol"));
      await user.type(screen.getByLabelText(/e-posta/i), "exists@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /kayıt ol/i }));

      await waitFor(() => {
        expect(screen.getByText("Bu e-posta adresi zaten kayıtlı.")).toBeInTheDocument();
      });
    });
  });

  describe("Google OAuth", () => {
    it("calls signInWithOAuth with google provider", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: null,
        error: null,
      });

      renderAuth();
      await user.click(screen.getByText("Google ile devam et"));

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: "http://localhost:5173" },
      });
    });

    it("shows error toast on Google OAuth failure", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: null,
        error: { message: "OAuth failed" } as any,
      });

      renderAuth();
      await user.click(screen.getByText("Google ile devam et"));

      await waitFor(() => {
        expect(screen.getByText("OAuth failed")).toBeInTheDocument();
      });
    });
  });

  describe("Resend Verification", () => {
    it("calls resend with valid email", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.resend).mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email not confirmed" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("E-posta Onayı")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /onay e-postasını tekrar gönder/i }));

      expect(supabase.auth.resend).toHaveBeenCalledWith({
        type: "signup",
        email: "test@example.com",
        options: { emailRedirectTo: "http://localhost:5173/" },
      });
    });

    it("shows validation error for invalid email in resend", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email not confirmed" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("E-posta Onayı")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/e-posta/i);
      await user.clear(emailInput);
      await user.type(emailInput, "invalid");
      await user.click(screen.getByRole("button", { name: /onay e-postasını tekrar gönder/i }));

      expect(screen.getByText("Geçerli bir e-posta adresi girin")).toBeInTheDocument();
    });

    it("returns to login mode on button click", async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email not confirmed" } as any,
      });

      renderAuth();
      await user.type(screen.getByLabelText(/e-posta/i), "test@example.com");
      await user.type(screen.getByLabelText(/şifre/i), "password123");
      await user.click(screen.getByRole("button", { name: /giriş yap/i }));

      await waitFor(() => {
        expect(screen.getByText("E-posta Onayı")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Giriş sayfasına dön"));
      expect(screen.getByRole("button", { name: /giriş yap/i })).toBeInTheDocument();
    });
  });

  describe("UI Interactions", () => {
    it("toggles password visibility", async () => {
      const user = userEvent.setup();
      renderAuth();
      const passwordInput = screen.getByLabelText(/şifre/i) as HTMLInputElement;
      expect(passwordInput.type).toBe("password");

      const toggleButton = passwordInput.parentElement!.querySelector("button[type='button']")!;
      await user.click(toggleButton);
      expect(passwordInput.type).toBe("text");

      await user.click(toggleButton);
      expect(passwordInput.type).toBe("password");
    });

    it("toggles between login and signup modes", async () => {
      const user = userEvent.setup();
      renderAuth();

      await user.click(screen.getByText("Kayıt Ol"));
      expect(screen.getByText("Zaten hesabınız var mı?")).toBeInTheDocument();

      await user.click(screen.getByText("Giriş Yap"));
      expect(screen.getByText("Hesabınız yok mu?")).toBeInTheDocument();
    });
  });
});
