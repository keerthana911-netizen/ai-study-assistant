function inlineText(value: string) {
  return value.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-white/10 px-1.5 py-0.5 text-violet-200">{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function FormattedContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; text: string }[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={`p-${blocks.length}`}>{paragraph.join(" ")}</p>);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (!list.length) return;
    const ordered = list[0].ordered;
    const ListTag = ordered ? "ol" : "ul";
    blocks.push(
      <ListTag key={`list-${blocks.length}`} className={ordered ? "list-decimal pl-5 space-y-1" : "list-disc pl-5 space-y-1"}>
        {list.map((item, index) => <li key={index}>{inlineText(item.text)}</li>)}
      </ListTag>
    );
    list = [];
  };

  lines.forEach((line) => {
    const text = line.trim();
    if (!text) {
      flushParagraph();
      flushList();
      return;
    }
    if (/^[-*_]{3,}$/.test(text)) return;

    const heading = text.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(<h3 key={`h-${blocks.length}`} className="text-lg font-semibold text-white pt-2">{inlineText(heading[1])}</h3>);
      return;
    }

    const bullet = text.match(/^[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push({ ordered: false, text: bullet[1] });
      return;
    }

    const numbered = text.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      list.push({ ordered: true, text: numbered[1] });
      return;
    }

    flushList();
    paragraph.push(text);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-4 leading-relaxed text-zinc-200">{blocks}</div>;
}
import type { ReactNode } from "react";
