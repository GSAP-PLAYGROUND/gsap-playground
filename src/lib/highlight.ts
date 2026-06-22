// CSS Syntax Highlighter using One Dark Pro theme colors
export const highlightCss = (code: string) => {
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Extract comments first to prevent styling collisions
  const comments: string[] = [];
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
    comments.push(`<span class="text-[#5c6370] italic">${match}</span>`);
    return `___CSS_COMMENT_PLACEHOLDER_${comments.length - 1}___`;
  });

  // 2. Highlight selectors (e.g. .brutalist-card, :root)
  html = html.replace(/([^{}\n]+)\s*(?={)/g, (match) => {
    if (!match.trim()) return match;
    return `<span class="text-[#e06c75] font-semibold">${match}</span>`;
  });

  // 3. Highlight properties (e.g. background, border)
  html = html.replace(/([a-zA-Z-]+)\s*:/g, (match, p1) => {
    return `<span class="text-[#d19a66]">${p1}</span>:`;
  });

  // 4. Highlight values
  html = html.replace(/:\s*([^;{}]+)/g, (match, p1) => {
    return `: <span class="text-[#98c379]">${p1}</span>`;
  });

  // 5. Restore comments
  html = html.replace(/___CSS_COMMENT_PLACEHOLDER_(\d+)___/g, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return comments[idx];
  });

  // 6. Highlight braces
  html = html.replace(/([{};])/g, '<span class="text-[#abb2bf]">$1</span>');

  return html;
};

// Custom RegExp syntax highlighter utilizing VS Code One Dark Pro scheme
export const highlightCode = (code: string, fileName: string) => {
  if (fileName.endsWith(".css")) {
    return highlightCss(code);
  }
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const insertedTags: string[] = [];
  const wrap = (content: string, className: string) => {
    insertedTags.push(`<span class="${className}">${content}</span>`);
    return `___TAG_PLACEHOLDER_${insertedTags.length - 1}___`;
  };

  const tokenPlaceholders: { type: "comment" | "string"; content: string }[] =
    [];

  // Match comments and strings in a single pass to avoid collisions
  const tokenRegex =
    /(\/\/.*|\/\*[\s\S]*?\*\/|&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|`[\s\S]*?`)/g;

  html = html.replace(tokenRegex, (match) => {
    const isComment = match.startsWith("//") || match.startsWith("/*");
    tokenPlaceholders.push({
      type: isComment ? "comment" : "string",
      content: match,
    });
    return `___TOKEN_PLACEHOLDER_${tokenPlaceholders.length - 1}___`;
  });

  // Highlight numbers (purple)
  html = html.replace(/\b(\d+)\b/g, (match) => wrap(match, "text-[#d19a66]"));

  // Keywords (high-contrast magenta)
  const keywords = [
    "import",
    "export",
    "default",
    "const",
    "let",
    "var",
    "function",
    "return",
    "interface",
    "type",
    "extends",
    "implements",
    "from",
    "as",
    "true",
    "false",
    "null",
    "undefined",
    "async",
    "await",
    "new",
    "typeof",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "class",
  ];
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  html = html.replace(keywordPattern, (_, match) =>
    wrap(match, "text-[#c678dd]"),
  );

  // React component and core hook names (cyan)
  const hooks = [
    "useGSAP",
    "useRef",
    "useState",
    "useEffect",
    "contextSafe",
    "ScrollTrigger",
    "gsap",
  ];
  const hooksPattern = new RegExp(`\\b(${hooks.join("|")})\\b`, "g");
  html = html.replace(hooksPattern, (_, match) =>
    wrap(match, "text-[#56b6c2] font-semibold"),
  );

  // Built-in functions and methods (blue)
  const builtins = [
    "registerPlugin",
    "timeline",
    "fromTo",
    "kill",
    "revert",
    "split",
    "map",
    "forEach",
    "find",
    "push",
    "addEventListener",
    "removeEventListener",
    "getBoundingClientRect",
    "querySelector",
    "querySelectorAll",
  ];
  const builtinsPattern = new RegExp(`\\b(${builtins.join("|")})\\b`, "g");
  html = html.replace(builtinsPattern, (_, match) =>
    wrap(match, "text-[#61afef]"),
  );

  // JSX tag names (red/pink)
  html = html.replace(/(&lt;\/?[a-zA-Z0-9-]+)/gi, (match) =>
    wrap(match, "text-[#e06c75]"),
  );

  // HTML/JSX Attributes (gold)
  html = html.replace(
    /\b(className|ref|onClick|onChange|style|key|id|type|placeholder|value|maxLength|initialText|bgColor|textColor|tiltClass|route|name|description)\b=/g,
    (match, p1) => {
      return `${wrap(p1, "text-[#d19a66]")}=`;
    },
  );

  // Highlight brackets and punctuation (light gray)
  html = html.replace(
    /([{}[\]().,:])|(?<!&(lt|gt|amp|quot|#39));/g,
    (match) => {
      return wrap(match, "text-[#abb2bf]");
    },
  );

  // Re-insert tag placeholders
  const tagPlaceholderRegex = /___TAG_PLACEHOLDER_(\d+)___/g;
  html = html.replace(tagPlaceholderRegex, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return insertedTags[idx];
  });

  // Re-insert comments & strings (green and dim gray)
  const tokenPlaceholderRegex = /___TOKEN_PLACEHOLDER_(\d+)___/g;
  html = html.replace(tokenPlaceholderRegex, (_, indexStr) => {
    const idx = parseInt(indexStr, 10);
    const token = tokenPlaceholders[idx];
    if (token.type === "comment") {
      return `<span class="text-[#5c6370] italic">${token.content}</span>`;
    } else {
      return `<span class="text-[#98c379]">${token.content}</span>`;
    }
  });

  return html;
};
