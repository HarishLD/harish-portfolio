import type { Layer } from "@/content";
import { cx } from "@/lib/cx";

/**
 * The hero device in its three forms, stacked in one square stage:
 * phone (mobile) → browser (web) → server (backend).
 * Pure CSS fake 3D on desktop: a tilted stage (rotateY -24deg, rotateX 8deg),
 * flat below xl (tilted layers render with stepped edges on high-DPR phones). Matte ink
 * bodies with a 9px bezel, a hard offset shadow and one soft floor shadow.
 * Screens are abstract UI, not client product screens.
 *
 * `data-state` on the stage picks the visible face with plain CSS, so it works
 * with no JS and under reduced motion; HeroMorph scrubs the faces with GSAP.
 */

const body =
  "absolute rounded-device bg-ink p-[var(--bezel)] shadow-[14px_16px_0_var(--color-line)]";
const face =
  "motion-fade opacity-0 transition-opacity duration-(--duration-ui) xl:will-change-transform";

function Bar({ className }: { className?: string }) {
  return <span className={cx("block rounded-pill bg-ink-3", className)} />;
}

function PhoneFace() {
  return (
    <div
      data-face="mobile"
      className={cx(
        face,
        body,
        "inset-y-[3%] left-[27%] w-[46%] group-data-[state=mobile]/stage:opacity-100",
      )}
    >
      <div className="flex h-full flex-col gap-[6%] overflow-hidden rounded-[calc(var(--radius-device)-var(--bezel))] bg-ink-2 p-[9%]">
        <div className="mx-auto h-[3%] w-[34%] rounded-pill bg-ink" />
        <Bar className="h-[4%] w-[55%] bg-fog/70" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-[8%] rounded-inner bg-ink-3 p-[8%]">
            <span
              className={cx(
                "aspect-square w-[22%] rounded-pill",
                i === 0 ? "bg-signal" : "bg-ink-2",
              )}
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <Bar className="h-1.5 w-[80%] bg-fog/50" />
              <Bar className="h-1.5 w-[50%] bg-fog/25" />
            </div>
          </div>
        ))}
        <Bar className="mt-auto h-[7%] w-full bg-paper/85" />
      </div>
    </div>
  );
}

function BrowserFace() {
  return (
    <div
      data-face="web"
      className={cx(
        face,
        body,
        "inset-x-0 top-[18%] h-[64%] rounded-[22px] group-data-[state=web]/stage:opacity-100",
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[13px] bg-ink-2">
        <div className="flex h-[12%] items-center gap-1.5 bg-ink-3 px-[3%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-pill bg-fog/40" />
          ))}
          <Bar className="ml-[4%] h-[44%] w-[46%] bg-ink-2" />
        </div>
        <div className="grid flex-1 grid-cols-[22%_1fr] gap-[3%] p-[4%]">
          <div className="flex flex-col gap-2">
            <Bar className="h-2 w-[80%] bg-fog/50" />
            <Bar className="h-2 w-[60%] bg-fog/25" />
            <Bar className="h-2 w-[70%] bg-fog/25" />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-[6%]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-end gap-1.5 rounded-inner bg-ink-3 p-[8%]"
              >
                {i === 0 && <span className="size-2 rounded-pill bg-signal" />}
                <Bar className="h-1.5 w-[70%] bg-fog/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServerFace() {
  return (
    <div
      data-face="backend"
      className={cx(
        face,
        "absolute inset-x-[8%] top-[16%] flex h-[68%] flex-col justify-center gap-[6%]",
        "group-data-[state=backend]/stage:opacity-100",
      )}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          data-server-unit=""
          className="relative flex h-[26%] items-center gap-[4%] rounded-[18px] bg-ink px-[7%] shadow-[14px_16px_0_var(--color-line)]"
        >
          <div className="flex flex-1 flex-col gap-[10%] self-stretch py-[6%]">
            {[0, 1, 2].map((v) => (
              <span key={v} className="block h-[3px] w-full rounded-pill bg-ink-3" />
            ))}
          </div>
          <span className={cx("size-2.5 rounded-pill", i === 1 ? "bg-signal" : "bg-fog/40")} />
          <span className="size-2.5 rounded-pill bg-fog/40" />
        </div>
      ))}
    </div>
  );
}

export function Device({ state, className }: { state: Layer; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("relative aspect-square xl:[perspective:1400px]", className)}
    >
      {/* One soft shadow on paper, as a gradient (no filters). */}
      <span
        aria-hidden="true"
        className="absolute inset-x-[10%] bottom-[-2%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(11_11_10/0.22),transparent)]"
      />
      <div
        data-device-stage=""
        data-state={state}
        className="group/stage relative size-full [transform:rotateY(-24deg)_rotateX(8deg)] [--bezel:9px] [transform-style:preserve-3d]"
      >
        <PhoneFace />
        <BrowserFace />
        <ServerFace />
      </div>
    </div>
  );
}
