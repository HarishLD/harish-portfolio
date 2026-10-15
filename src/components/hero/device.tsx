import { PetBookingPhone, PetScheduleBrowser } from "@/components/screens/pet-care";
import type { Layer } from "@/content";
import { cx } from "@/lib/cx";

/**
 * The Layers device in its three forms, stacked in one square stage:
 * phone (mobile) → browser (web) → server (backend).
 * Pure CSS fake 3D on desktop: a tilted stage (rotateY -24deg, rotateX 8deg),
 * flat below xl (tilted layers render with stepped edges on high-DPR phones). Matte ink
 * bodies with a 9px bezel, a hard offset shadow and one soft floor shadow.
 * Screens are the recreated Pet Care UI (sample data): booking phone, schedule
 * dashboard, and a server rack with blinking LEDs over a scrolling request
 * log (CSS-only, see `.device-live` in globals.css).
 *
 * `data-state` on the stage picks the visible face with plain CSS, so it works
 * with no JS and under reduced motion. The pinned Layers layout drives the
 * morph with GSAP (`threeD` keeps the tilt at every size).
 */

// Body and hard-shadow colours are variables (--device-body / --device-shadow)
// so the device reads on ink in Layers; defaults are for paper.
const face =
  "motion-fade opacity-0 transition-opacity duration-(--duration-ui) xl:will-change-transform";

const LOG = [
  ["GET", "/slots?day=14", "200", "18ms"],
  ["POST", "/bookings", "201", "88ms"],
  ["PATCH", "/crm/sync", "200", "31ms"],
  ["GET", "/bookings/today", "200", "42ms"],
  ["POST", "/payments/intent", "201", "64ms"],
  ["WS", "/video/session", "101", "open"],
  ["GET", "/locations", "200", "12ms"],
  ["POST", "/crm/sync", "200", "27ms"],
];

/** Phone: the recreated booking screen. */
function PhoneFace() {
  return (
    <div
      data-face="mobile"
      className={cx(
        face,
        "absolute inset-y-[1.5%] left-[27%] w-[46%] group-data-[state=mobile]/stage:opacity-100",
      )}
    >
      <PetBookingPhone className="w-full" />
    </div>
  );
}

/** Browser: the recreated location schedule. */
function BrowserFace() {
  return (
    <div
      data-face="web"
      className={cx(
        face,
        "absolute inset-x-0 top-[18.75%] group-data-[state=web]/stage:opacity-100",
      )}
    >
      <PetScheduleBrowser className="w-full" />
    </div>
  );
}

/** Server: three rack units with blinking LEDs over a scrolling request log (sample data). */
function ServerFace() {
  return (
    <div
      data-face="backend"
      className={cx(
        face,
        "absolute inset-x-[6%] inset-y-[10%] flex flex-col gap-[3.5%]",
        "group-data-[state=backend]/stage:opacity-100",
      )}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          data-server-unit=""
          className="relative flex h-[15%] shrink-0 items-center gap-[3%] rounded-[4cqw] bg-(--device-body,var(--color-ink)) px-[6%] shadow-[min(14px,4cqw)_min(16px,4.6cqw)_0_var(--device-shadow,var(--color-line))]"
        >
          <div className="flex flex-1 flex-col gap-[1.4cqw]">
            {[0, 1, 2].map((v) => (
              <span key={v} className="block h-[0.7cqw] w-full rounded-pill bg-ink-2" />
            ))}
          </div>
          {[0, 1, 2].map((led) => (
            <span
              key={led}
              data-led=""
              style={{ animationDelay: `${(i * 3 + led) * 0.37}s` }}
              className={cx(
                "size-[2.4cqw] rounded-pill",
                i === 1 && led === 0 ? "bg-signal" : "bg-fog/50",
              )}
            />
          ))}
        </div>
      ))}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[4cqw] border border-ink-3 bg-ink-2 px-[5%] py-[4%] font-mono text-[2.9cqw] leading-[1.7] text-fog">
        <ul data-log="">
          {[...LOG, ...LOG].map(([method, path, status, time], n) => (
            <li key={n} className="flex gap-[3cqw] whitespace-nowrap">
              <span className="w-[11cqw] text-paper">{method}</span>
              <span className="flex-1 truncate">{path}</span>
              <span className={status === "201" ? "text-signal" : undefined}>{status}</span>
              <span className="w-[9cqw] text-right">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Device({
  state,
  threeD = false,
  only = false,
  className,
}: {
  state: Layer;
  /** Render just the face for `state` (static layouts); the morph needs all three. */
  only?: boolean;
  /** Tilt and 3D context at every size (Layers). Default: only on xl, flat below. */
  threeD?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-device=""
      className={cx(
        "device-live @container relative aspect-square",
        threeD ? "[perspective:1400px]" : "xl:[perspective:1400px]",
        className,
      )}
    >
      {/* One soft shadow on paper, as a gradient (no filters). */}
      <span
        aria-hidden="true"
        data-device-shadow=""
        className="absolute inset-x-[10%] bottom-[-2%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(11_11_10/0.22),transparent)]"
      />
      <div
        data-device-stage=""
        data-state={state}
        className={cx(
          // Spec values (34px radius, 9px bezel) at hero size, scaled down with the
          // device so small phones (Layers cards) don't turn into pills.
          "group/stage relative size-full [--bezel:min(9px,2.6cqw)] [--r:min(var(--radius-device),10cqw)]",
          threeD
            ? "[transform:rotateY(-24deg)_rotateX(8deg)] [transform-style:preserve-3d]"
            : "xl:[transform:rotateY(-24deg)_rotateX(8deg)] xl:[transform-style:preserve-3d]",
        )}
      >
        {(!only || state === "mobile") && <PhoneFace />}
        {(!only || state === "web") && <BrowserFace />}
        {(!only || state === "backend") && <ServerFace />}
      </div>
    </div>
  );
}
