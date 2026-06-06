"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

// Tighter list/paragraph spacing than prose defaults; shared by editor + detail view.
export const PROSE_TIGHT =
  "[&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_li>p]:my-0";

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    immediatelyRender: false, // required for Next SSR to avoid hydration mismatch
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https", "mailto"],
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
    ],
    content: defaultValue ?? "",
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `prose prose-sm prose-slate max-w-none px-3 py-2 focus:outline-none ${PROSE_TIGHT}`,
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
      {/* Toolbar stays fixed above the scroll area */}
      {editor && <Toolbar editor={editor} />}
      {/* Long text scrolls inside the editor instead of the page */}
      <div className="max-h-80 min-h-40 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const openLink = () => {
    setLinkUrl((editor.getAttributes("link").href as string) ?? "https://");
    setLinkOpen(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (url === "") chain.unsetLink().run();
    else chain.setLink({ href: url }).run();
    setLinkOpen(false);
  };

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5">
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <span className="font-bold">B</span>
        </Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <span className="italic">I</span>
        </Btn>
        <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading">
          H
        </Btn>
        <Divider />
        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bulleted list">
          • List
        </Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list">
          1. List
        </Btn>
        <Divider />
        <Btn active={editor.isActive("link") || linkOpen} onClick={openLink} label="Add link">
          Link
        </Btn>
        {editor.isActive("link") && (
          <Btn active={false} onClick={() => editor.chain().focus().unsetLink().run()} label="Remove link">
            Unlink
          </Btn>
        )}
      </div>

      {/* Inline link input (replaces window.prompt) */}
      {linkOpen && (
        <div className="flex items-center gap-2 border-t border-slate-200 px-2 py-1.5">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                setLinkOpen(false);
              }
            }}
            placeholder="https://example.com"
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="button"
            onClick={applyLink}
            className="brand-gradient h-8 rounded px-3 text-sm font-medium text-white"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="h-8 rounded px-2 text-sm text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function Btn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-sm transition ${
        active ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-slate-300" />;
}
