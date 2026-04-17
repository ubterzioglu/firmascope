import React, { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

interface RouterWrapperOptions {
  route?: string;
  routes?: { path: string; element: React.ReactElement }[];
}

export function createRouterWrapper(options: RouterWrapperOptions = {}) {
  const { route = "/", routes } = options;
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          {routes?.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<>{children}</>} />
        </Routes>
      </MemoryRouter>
    );
  };
}

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  route?: string;
  routes?: { path: string; element: React.ReactElement }[];
}

export function renderWithRouter(
  ui: React.ReactElement,
  options: RenderWithRouterOptions = {}
) {
  const { route, routes, ...renderOptions } = options;
  const Wrapper = createRouterWrapper({ route, routes });
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
