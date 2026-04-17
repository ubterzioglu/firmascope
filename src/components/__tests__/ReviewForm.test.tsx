import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewForm from "@/components/ReviewForm";

const mockUser = { id: "user-1", email: "test@test.com" } as any;

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

describe("ReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders first step with context fields", () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText("Değerlendirme Yaz")).toBeInTheDocument();
    expect(screen.getByText("Adım 1/3")).toBeInTheDocument();
    expect(screen.getByText("Genel Puan *")).toBeInTheDocument();
  });

  it("shows error when advancing without required fields", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /devam/i }));
    expect(screen.getByText("Eksik alan")).toBeInTheDocument();
  });

  it("advances to step 2 when required fields filled", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    const stars = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg.lucide-star")
    );
    if (stars.length > 0) await user.click(stars[4]);

    await user.click(screen.getByText("✓ Tavsiye Ederim"));

    const mevcutBtn = screen.getByText("Mevcut Çalışan");
    await user.click(mevcutBtn);

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/3")).toBeInTheDocument();
    });
  });

  it("calls onSuccess on successful submit", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: null }));

    render(<ReviewForm {...defaultProps} />);

    const stars = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg.lucide-star")
    );
    if (stars.length > 0) await user.click(stars[4]);
    await user.click(screen.getByText("✓ Tavsiye Ederim"));
    await user.click(screen.getByText("Mevcut Çalışan"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 3/3")).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /değerlendirmeyi gönder/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("shows error toast on submit failure", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: { message: "fail" } }));

    render(<ReviewForm {...defaultProps} />);

    const stars = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg.lucide-star")
    );
    if (stars.length > 0) await user.click(stars[4]);
    await user.click(screen.getByText("✓ Tavsiye Ederim"));
    await user.click(screen.getByText("Mevcut Çalışan"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 3/3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /değerlendirmeyi gönder/i }));

    await waitFor(() => {
      expect(screen.getByText("Değerlendirme gönderilemedi.")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel clicked", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /iptal/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it("navigates back with Geri button", async () => {
    const user = userEvent.setup();
    render(<ReviewForm {...defaultProps} />);

    const stars = screen.getAllByRole("button").filter(
      (b) => b.querySelector("svg.lucide-star")
    );
    if (stars.length > 0) await user.click(stars[4]);
    await user.click(screen.getByText("✓ Tavsiye Ederim"));
    await user.click(screen.getByText("Mevcut Çalışan"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /geri/i }));
    expect(screen.getByText("Adım 1/3")).toBeInTheDocument();
  });
});
