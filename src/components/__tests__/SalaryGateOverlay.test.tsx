import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SalaryGateOverlay from "@/components/SalaryGateOverlay";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
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
}));

function renderSalaryGate() {
  const onSubmitSalary = vi.fn();
  const result = render(
    <MemoryRouter>
      <SalaryGateOverlay onSubmitSalary={onSubmitSalary} />
    </MemoryRouter>
  );
  return { ...result, onSubmitSalary };
}

describe("SalaryGateOverlay", () => {
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

  it("shows 'Giriş Yap' link when not logged in", () => {
    renderSalaryGate();
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument();
    expect(screen.queryByText("Maaş Bilgisi Paylaş")).not.toBeInTheDocument();
  });

  it("shows 'Maaş Bilgisi Paylaş' button when logged in", () => {
    authContextValue.user = mockUser;
    renderSalaryGate();
    expect(screen.getByText("Maaş Bilgisi Paylaş")).toBeInTheDocument();
    expect(screen.queryByText("Giriş Yap")).not.toBeInTheDocument();
  });

  it("calls onSubmitSalary when button clicked", async () => {
    const user = userEvent.setup();
    authContextValue.user = mockUser;
    const { onSubmitSalary } = renderSalaryGate();
    await user.click(screen.getByText("Maaş Bilgisi Paylaş"));
    expect(onSubmitSalary).toHaveBeenCalled();
  });

  it("renders blurred preview placeholders", () => {
    renderSalaryGate();
    const blurredSection = document.querySelector(".blur-md");
    expect(blurredSection).toBeInTheDocument();
  });

  it("renders gate description text", () => {
    renderSalaryGate();
    expect(screen.getByText(/Maaş verilerini görmek için paylaş/)).toBeInTheDocument();
  });
});
