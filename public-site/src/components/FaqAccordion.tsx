"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  id: string;
  title: string;
  items: FaqItem[];
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full p-8 text-left cursor-pointer hover:bg-surface-container-high transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-xl text-primary pr-4">
          {item.question}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-8 pb-8 text-on-surface-variant leading-relaxed">
            <p>{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ sections }: { sections: FaqSection[] }) {
  // Track which items are open. Key format: "sectionIndex-itemIndex"
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(["0-0"]) // first item open by default
  );

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="space-y-24">
      {sections.map((section, sectionIdx) => (
        <section key={section.id} id={section.id}>
          <h2 className="font-heading text-3xl text-primary mb-10 pb-4 border-b border-outline-variant/30">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.items.map((item, itemIdx) => {
              const key = `${sectionIdx}-${itemIdx}`;
              return (
                <AccordionItem
                  key={key}
                  item={item}
                  isOpen={openItems.has(key)}
                  onToggle={() => toggle(key)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
