import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InterviewForm from "@/components/InterviewForm";

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

describe("InterviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders step 1 with required fields", () => {
    render(<InterviewForm {...defaultProps} />);
    expect(screen.getByText("Mülakat Deneyimi Paylaş")).toBeInTheDocument();
    expect(screen.getByText("Adım 1/2")).toBeInTheDocument();
    expect(screen.getByText("Pozisyon *")).toBeInTheDocument();
  });

  it("shows error when advancing without required fields", async () => {
    const user = userEvent.setup();
    render(<InterviewForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /devam/i }));
    expect(screen.getByText("Eksik alan")).toBeInTheDocument();
  });

  it("advances to step 2 when required fields filled", async () => {
    const user = userEvent.setup();
    render(<InterviewForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Frontend Developer"), "Backend Dev");
    await user.click(screen.getByText("Orta"));
    await user.click(screen.getByText("Teklif Aldım"));

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });
  });

  it("shows offered salary fields when result is 'Teklif Aldım'", async () => {
    const user = userEvent.setup();
    render(<InterviewForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Frontend Developer"), "Backend Dev");
    await user.click(screen.getByText("Orta"));
    await user.click(screen.getByText("Teklif Aldım"));

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Teklif Edilen Maaş")).toBeInTheDocument();
    });
  });

  it("hides offered salary when result is not 'Teklif Aldım'", async () => {
    const user = userEvent.setup();
    render(<InterviewForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Frontend Developer"), "Backend Dev");
    await user.click(screen.getByText("Orta"));
    await user.click(screen.getByText("Reddedildi"));

    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    expect(screen.queryByText("Teklif Edilen Maaş")).not.toBeInTheDocument();
  });

  it("calls onSuccess on successful submit", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: null }));

    render(<InterviewForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Frontend Developer"), "Backend Dev");
    await user.click(screen.getByText("Orta"));
    await user.click(screen.getByText("Süreçte"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /mülakat bilgisini gönder/i }));

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("shows error toast on submit failure", async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockReturnValue(createChainable({ data: null, error: { message: "fail" } }));

    render(<InterviewForm {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Frontend Developer"), "Backend Dev");
    await user.click(screen.getByText("Orta"));
    await user.click(screen.getByText("Süreçte"));
    await user.click(screen.getByRole("button", { name: /devam/i }));

    await waitFor(() => {
      expect(screen.getByText("Adım 2/2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /mülakat bilgisini gönder/i }));

    await waitFor(() => {
      expect(screen.getByText("Mülakat deneyimi gönderilemedi.")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel clicked", async () => {
    const user = userEvent.setup();
    render(<InterviewForm {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /iptal/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
