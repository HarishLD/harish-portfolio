import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { gsapMock, loaderMocks } from "@/test/gsap-mock";
import { type Gsap, afterLoad, useLazyGsap } from ".";

function Probe({ load, setup }: { load: "idle" | "visible"; setup: (gsap: Gsap) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLazyGsap(ref, setup, { load });
  return <div ref={ref} />;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe("useLazyGsap", () => {
  it("loads GSAP on idle and runs setup inside a context", async () => {
    const setup = vi.fn();
    render(<Probe load="idle" setup={setup} />);
    await waitFor(() => expect(setup).toHaveBeenCalledWith(gsapMock));
    expect(gsapMock.context).toHaveBeenCalledOnce();
  });

  it("waits for the scope to approach the viewport", async () => {
    const setup = vi.fn();
    render(<Probe load="visible" setup={setup} />);
    await new Promise((r) => setTimeout(r, 300));
    expect(loaderMocks.loadGsap).not.toHaveBeenCalled();
    expect(setup).not.toHaveBeenCalled();
  });

  it("never runs setup if it unmounts before the import resolves", async () => {
    const pending = deferred<Gsap>();
    loaderMocks.loadGsap.mockImplementationOnce(() => pending.promise);
    const setup = vi.fn();
    const { unmount } = render(<Probe load="idle" setup={setup} />);
    await waitFor(() => expect(loaderMocks.loadGsap).toHaveBeenCalled());

    unmount();
    pending.resolve(gsapMock as unknown as Gsap);
    await pending.promise;
    await new Promise((r) => setTimeout(r, 0));
    expect(setup).not.toHaveBeenCalled();
    expect(gsapMock.context).not.toHaveBeenCalled();
  });
});

describe("afterLoad", () => {
  it("skips the callback when the signal was aborted first", async () => {
    const controller = new AbortController();
    const use = vi.fn();
    const load = Promise.resolve(1);
    afterLoad(load, controller.signal, use);
    controller.abort();
    await load;
    expect(use).not.toHaveBeenCalled();
  });

  it("swallows a failed load (animation is optional)", async () => {
    const use = vi.fn();
    const failed = Promise.reject(new Error("chunk failed"));
    afterLoad(failed, new AbortController().signal, use);
    await failed.catch(() => {});
    await new Promise((r) => setTimeout(r, 0));
    expect(use).not.toHaveBeenCalled();
  });
});
