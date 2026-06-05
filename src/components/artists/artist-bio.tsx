"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseBioSections } from "@/lib/artists/artist-bio-utils";

type ArtistBioProps = {
  biography: string;
  previewCount?: number;
};

export function ArtistBio({ biography, previewCount = 2 }: ArtistBioProps) {
  const [expanded, setExpanded] = useState(false);
  const sections = parseBioSections(biography);

  if (sections.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted-foreground italic">
        Biografía en preparación.
      </p>
    );
  }

  const visible = expanded ? sections : sections.slice(0, previewCount);
  const hasMore = sections.length > previewCount;

  return (
    <div>
      <div className="space-y-6">
        {visible.map((section, i) => (
          <div key={`${section.title ?? "p"}-${i}`}>
            {section.title && (
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-makina-pink">
                {section.title}
              </h3>
            )}
            <p className="text-base leading-relaxed text-muted-foreground">{section.body}</p>
          </div>
        ))}
      </div>
      {hasMore && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 text-makina-pink hover:text-makina-pink"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Leer menos" : "Leer más"}
        </Button>
      )}
    </div>
  );
}
