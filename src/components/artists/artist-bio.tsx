"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseParagraphs } from "@/lib/artists/artist-bio-utils";

type ArtistBioProps = {
  biography: string;
  /** Párrafos visibles antes de «Leer más» */
  previewCount?: number;
};

export function ArtistBio({ biography, previewCount = 2 }: ArtistBioProps) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = parseParagraphs(biography);

  if (paragraphs.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted-foreground italic">
        Biografía en preparación.
      </p>
    );
  }

  const visible = expanded ? paragraphs : paragraphs.slice(0, previewCount);
  const hasMore = paragraphs.length > previewCount;

  return (
    <div>
      <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
        {visible.map((p, i) => (
          <p key={i}>{p}</p>
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

