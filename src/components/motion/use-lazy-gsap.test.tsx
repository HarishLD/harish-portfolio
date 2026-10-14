import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useLazyGsap } from ".";

function Probe({ load, setup }: { load: "idle" | "visible"; setup: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLazyGsap(ref, setup, { load });
  return <div ref={ref} />;
}

describe("useLazyGsap", () => {
  it("loads GSAP on idle and runs setup with it", async () => {
    const setup = vi.fn();
    render(<Probe load="idle" setup={setup} />);
    await waitFor(() => expect(setup).toHaveBeenCalledOnce());
    expect(setup.mock.calls[0]?.[0]).toHaveProperty("to");
  });

  it("waits for the scope to approach the viewport", async () => {
    const setup = vi.fn();
    render(<Probe load="visible" setup={setup} />);
    await new Promise((r) => setTimeout(r, 300));
    expect(setup).not.toHaveBeenCalled();
  });
});
