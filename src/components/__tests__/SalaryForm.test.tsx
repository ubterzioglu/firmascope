import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SalaryForm from "@/components/SalaryForm";

const { createChainable } = vi.hoisted(() => {
  const createChainable = (resolvedValue: any = { data: null, error: null }) => {
    const chain: any = {};
    const mk = () => vi.fn().mockReturnValue(chain);
    chain.select = mk(); chain.insert = mk().mockResolvedValue(resolvedValue);
    chain.update = mk(); chain.delete = mk(); chain.eq = mk(); chain.order = mk();
    chain.then = vi.fn((cb: any) => cb(resolvedValue));
    return chain;
  };
  return { createChainable };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { signOut: vi.fn() },
    rpc: vi.fn(),
    from: vi.fn().mockReturnValue(createChainable()),
    storage: { from: vi.fn() },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import { supabase } from "@/integrations/supabase/client";

const defaultProps = {
  companyId: "comp-1",
  userId: "user-1",
  onSuccess: vi.fn(),
  onCancel: vi.fn(),
};

describe("SalaryForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders step 1 with required fields", () => {
    render(<SalaryForm {...defaultProps} />);
    expect(screen.getByText("Maaş Bilgisi Ekle")).toBeInTheDocument();
    expect(screen.getByText("Adım 1/2")).toBeInTheDocument();
    expect(screen.getByText("Pozisyon *")).toBeInTheDocument();
  });

  it("shows error when advancing without required fields", async () => {
    const user = userEvent.setup();
    render(<SalaryForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /devam/i }));
    expect(screen.getByText("Eksik alan")).toBeInTheDocument();
  });

  it("advances to step 2 when all required fields filled", async () => {
    const user = userEvent.setup();
    render(<SalaryForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Yazılım Mühendisi"), "Frontend Dev");
    await user.type(screen.getByPlaceholderText("50000"), "60000");
    await user.click(screen.getByText("Net"));
    await user.type(screen.getByPlaceholderText("3"), "5");
    await user.click(screen.getByText("Tam Zamanlı"));
    await user.click(screen.getByText("Mid-Level"));

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });
  });

  it("calls onSuccess on successful submit", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: null }));

    render(<SalaryForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Yazılım Mühendisi"), "Frontend Dev");
    await user.type(screen.getByPlaceholderText("50000"), "60000");
    await user.click(screen.getByText("Net"));
    await user.type(screen.getByPlaceholderText("3"), "5");
    await user.click(screen.getByText("Tam Zamanlı"));
    await user.click(screen.getByText("Mid-Level"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /maaş bilgisini gönder/i }));

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("shows error toast on submit failure", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: { message: "fail" } }));

    render(<SalaryForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Yazılım Mühendisi"), "Frontend Dev");
    await user.type(screen.getByPlaceholderText("50000"), "60000");
    await user.click(screen.getByText("Net"));
    await user.type(screen.getByPlaceholderText("3"), "5");
    await user.click(screen.getByText("Tam Zamanlı"));
    await user.click(screen.getByText("Mid-Level"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /maaş bilgisini gönder/i }));

    await waitFor(() => {
      expect(screen.getByText("Maaş bilgisi gönderilemedi.")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel clicked", async () => {
    const user = userEvent.setup();
    render(<SalaryForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /iptal/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it("navigates back with Geri button from step 2", async () => {
    const user = userEvent.setup();
    render(<SalaryForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Yazılım Mühendisi"), "Frontend Dev");
    await user.type(screen.getByPlaceholderText("50000"), "60000");
    await user.click(screen.getByText("Net"));
    await user.type(screen.getByPlaceholderText("3"), "5");
    await user.click(screen.getByText("Tam Zamanlı"));
    await user.click(screen.getByText("Mid-Level"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /geri/i }));
    expect(screen.getByText("Adım 1/2")).toBeInTheDocument();
  });
});
