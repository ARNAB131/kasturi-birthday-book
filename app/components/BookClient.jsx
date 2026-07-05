"use client";

import { useState } from "react";
import { pages } from "../data/bookPages";

export default function BookClient() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState("");

  const page = pages[index];

  const canGoBack = index > 0;
  const canGoNext = index < pages.length - 1;

  function changePage(direction) {
    if (turn) return;

    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= pages.length) return;

    setTurn(direction > 0 ? "next" : "prev");

    setTimeout(() => {
      setIndex(nextIndex);
      setTurn("");
    }, 620);
  }

  return (
    <section className="book-stage">
      <div className="book-title-strip">
        <p>For Kasturi</p>
        <span>Page {index + 1} of {pages.length}</span>
      </div>

      <div className="book-wrap">
        <div className="book-spine" />

        <article className={`book-sheet ${turn ? `turn-${turn}` : ""}`}>
          <PageContent page={page} />

          <div className="page-corner corner-top" />
          <div className="page-corner corner-bottom" />
        </article>
      </div>

      <div className="book-controls">
        <button onClick={() => changePage(-1)} disabled={!canGoBack || !!turn}>
          Previous Page
        </button>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((index + 1) / pages.length) * 100}%`
            }}
          />
        </div>

        <button onClick={() => changePage(1)} disabled={!canGoNext || !!turn}>
          Next Page
        </button>
      </div>
    </section>
  );
}

function PageContent({ page }) {
  if (page.type === "cover") {
    return (
      <div className="page-content cover-page">
        <p className="eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p className="cover-subtitle">{page.subtitle}</p>
        <div className="ornament">──── ◦ ♡ ◦ ────</div>
        <blockquote>{page.quote}</blockquote>
      </div>
    );
  }

  if (page.type === "photo") {
    return (
      <div className="page-content photo-page">
        <div className="photo-frame">
          <img src={page.image} alt={page.alt} />
          <p>{page.caption}</p>
        </div>

        <div className="photo-text">
          {page.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }

  if (page.type === "vow") {
    return (
      <div className="page-content vow-page">
        <p className="eyebrow">Final Page</p>
        <h2>{page.title}</h2>

        <div className="vow-list">
          {page.body.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <p className="signature">{page.signature}</p>
      </div>
    );
  }

  return (
    <div className="page-content story-page">
      <p className="eyebrow">Love Story</p>
      <h2>{page.title}</h2>

      <div className="story-body">
        {page.body.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
