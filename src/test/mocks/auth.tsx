import React, { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { AuthContext, AuthContextType } from "@/hooks/useAuth";

export const mockSignOut = vi.fn().mockResolvedValue(undefined);

export function createMockUser(overrides: Record<string, any> = {}) {
  return {
    id: "user-1",
    email: "test@test.com",
    created_at: "2024-01-01T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    ...overrides,
  };
}

export function createMockSession(overrides: Record<string, any> = {}) {
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_at: Date.now() / 1000 + 3600,
    token_type: "bearer",
    user: createMockUser(),
    ...overrides,
  };
}

const defaultAuthContext: AuthContextType = {
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: mockSignOut,
};

interface AllProvidersWrapperOptions {
  auth?: Partial<AuthContextType>;
  route?: string;
}

export function createAllProvidersWrapper(options: AllProvidersWrapperOptions = {}) {
  const { auth = {}, route = "/" } = options;
  const authValue = { ...defaultAuthContext, ...auth };

  return function AllProvidersWrapper({ children }: { children: ReactNode }) {
    return (
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="*" element={<>{children}</>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
}

interface RenderWithAuthOptions extends Omit<RenderOptions, "wrapper"> {
  auth?: Partial<AuthContextType>;
  route?: string;
}

export function renderWithAuth(
  ui: React.ReactElement,
  options: RenderWithAuthOptions = {}
) {
  const { auth, route, ...renderOptions } = options;
  const Wrapper = createAllProvidersWrapper({ auth, route });
  const authValue = { ...defaultAuthContext, ...auth };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    authValue,
  };
}

export { defaultAuthContext };
