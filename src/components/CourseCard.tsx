import Link from "next/link";
import { CoverArt } from "./CoverArt";
import { formatPrice, formatDateShort, isLive } from "@/lib/constants";

export type CourseCardData = {
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  level: string;
  priceCents: number;
  durationLabel: string;
  coverColor: string;
  rating: number;
  startAt: Date | null;
  seatsTotal: number | null;
  seatsTaken: number;
  _index?: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
  const live = isLive(course.type);
  const num = String((course._index ?? 0) + 1).padStart(2, "0");

  return (
    <Link href={`/formacoes/${course.slug}`} className="card card-hover overflow-hidden flex flex-col group">
      <div className="relative">
        <CoverArt color={course.coverColor} seed={(course._index ?? 0) + 1} label={num} height={150} />
        <span className={`badge absolute top-3 left-3 ${live ? "badge-live" : "badge-rec"}`}>
          {live && <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />}
          {live ? "Em direto" : "Gravada"}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <h3 className="text-lg font-semibold text-ink group-hover:text-glow transition-colors">{course.title}</h3>
        <div className="flex gap-4 font-mono text-[11px] text-faint flex-wrap">
          <span>◷ {course.durationLabel}</span>
          <span>◉ {course.level}</span>
        </div>
        <p className="text-sm text-muted flex-1">{course.subtitle}</p>

        <div className="flex items-center justify-between border-t border-border pt-3.5 mt-1">
          <div className="text-ink">
            <span className="text-xl font-semibold">{formatPrice(course.priceCents)}</span>
            <span className="font-mono text-[11px] text-faint ml-1">
              {live ? "/ inscrição" : "/ vitalício"}
            </span>
          </div>
          {live && course.startAt ? (
            <div className="text-right">
              <div className="font-mono text-[10px] text-live uppercase tracking-wider">Próxima data</div>
              <div className="font-semibold text-live">{formatDateShort(course.startAt)}</div>
            </div>
          ) : (
            <div className="text-live text-xs">
              ★★★★★ <span className="text-faint font-mono">{course.rating.toFixed(1).replace(".", ",")}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
