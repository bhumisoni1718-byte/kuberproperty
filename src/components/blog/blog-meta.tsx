import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { getBlogAuthorName, getBlogDisplayDate, type BlogAuthorFields, type BlogDateFields } from "@/lib/blog-utils";

type BlogMetaProps = BlogAuthorFields &
  BlogDateFields & {
    variant?: "card" | "detail";
  };

export function BlogMeta({ variant = "card", ...post }: BlogMetaProps) {
  const author = getBlogAuthorName(post);
  const date = getBlogDisplayDate(post);

  if (variant === "detail") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {date && (
          <time
            dateTime={date.toISOString()}
            className="inline-flex items-center gap-2 rounded-full bg-[#c8a84b]/15 px-4 py-1.5 text-sm font-semibold text-[#b8891f]"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            {format(date, "MMMM d, yyyy")}
          </time>
        )}
        <span className="inline-flex items-center gap-2 text-sm text-navy/70">
          <User className="h-4 w-4 text-gold" aria-hidden />
          By <span className="font-medium text-navy">{author}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-navy/10 pt-3">
      {date && (
        <time
          dateTime={date.toISOString()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b8891f]"
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {format(date, "MMM d, yyyy")}
        </time>
      )}
      <span className="inline-flex items-center gap-1.5 text-sm text-navy/60">
        <User className="h-3.5 w-3.5 text-gold/80" aria-hidden />
        {author}
      </span>
    </div>
  );
}
