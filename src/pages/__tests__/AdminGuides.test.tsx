import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminGuides from "@/pages/admin/AdminGuides";
import { ADMIN_GUIDES } from "@/lib/admin/guides";

function renderGuides() {
  return render(
    <MemoryRouter>
      <AdminGuides />
    </MemoryRouter>,
  );
}

describe("AdminGuides", () => {
  it("renders a guide entry for every admin section", () => {
    renderGuides();
    for (const guide of ADMIN_GUIDES) {
      expect(screen.getByText(guide.title)).toBeInTheDocument();
    }
  });

  it("filters guides by the search query", () => {
    renderGuides();
    fireEvent.change(screen.getByLabelText("Kılavuzlarda ara"), {
      target: { value: "Maaş" },
    });
    expect(screen.getByText("Maaşlar")).toBeInTheDocument();
    expect(screen.queryByText("Duyurular")).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", () => {
    renderGuides();
    fireEvent.change(screen.getByLabelText("Kılavuzlarda ara"), {
      target: { value: "zzzznomatch" },
    });
    expect(screen.getByText("Eşleşen kılavuz yok.")).toBeInTheDocument();
  });
});
