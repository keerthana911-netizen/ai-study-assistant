import type { ReactNode } from "react";

function inlineText(value: string) {
  const cleaned = value
    .replace(/\\([\\|*_#`])/g, "$1")
    .replace(/\|/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();

  return cleaned.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-white/10 px-1.5 py-0.5 text-violet-200">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function cleanText(value: string) {
  return value
    .replace(/\\([\\|*_#`])/g, "$1")
    .replace(/\|/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

function parseTableRow(value: string) {
  return value
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cleanText(cell));
}

function isTableSeparator(value: string) {
  const cells = parseTableRow(value);
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export default function FormattedContent({ content }: { content: string }) {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; text: string }[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={`p-${blocks.length}`}>{inlineText(paragraph.join(" "))}</p>
      );
      paragraph = [];
    }
  };

  const flushList = () => {
    if (!list.length) return;

    const ordered = list[0].ordered;
    const ListTag = ordered ? "ol" : "ul";

    blocks.push(
      <ListTag
        key={`list-${blocks.length}`}
        className={ordered ? "list-decimal pl-5 space-y-1" : "list-disc pl-5 space-y-1"}
      >
        {list.map((item, index) => (
          <li key={index}>{inlineText(item.text)}</li>
        ))}
      </ListTag>
    );

    list = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index].trim();

    if (!raw) {
      flushParagraph();
      flushList();
      continue;
    }

    if (raw.includes("|") && isTableSeparator(lines[index + 1]?.trim() ?? "")) {
      flushParagraph();
      flushList();

      const headers = parseTableRow(raw);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].includes("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }

      index -= 1;

      blocks.push(
        <div key={`table-${blocks.length}`} className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/15">
                {headers.map((header, headerIndex) => (
                  <th key={headerIndex} className="px-3 py-2 font-semibold text-white">
                    {inlineText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-white/10 align-top">
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 text-zinc-300">
                      {inlineText(row[cellIndex] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const text = cleanText(raw);

    if (!text || /^[-*_]{2,}$/.test(text)) continue;

    const heading = text.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="text-lg font-semibold text-white pt-2"
        >
          {inlineText(heading[1])}
        </h3>
      );
      continue;
    }

    const bullet = text.match(/^[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push({ ordered: false, text: bullet[1] });
      continue;
    }

    const numbered = text.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      list.push({ ordered: true, text: numbered[1] });
      continue;
    }

    flushList();
    paragraph.push(text);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-4 leading-relaxed text-zinc-200">{blocks}</div>;
}
