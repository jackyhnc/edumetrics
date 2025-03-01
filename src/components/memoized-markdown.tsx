import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import "katex/dist/katex.min.css"

const processContent = (content: string) => {
  // Handle tabs
  content = content.replace(/\t/g, '    ');

  content = content.replace(/^(\s*)[*+-] /gm, (p1) => {
    const indentLevel = Math.floor(p1.length / 2);
    const bullet = indentLevel === 0 ? '•' : indentLevel === 1 ? '◦' : '•';
    return `${p1}${bullet} `;
  });
  
  // Remove extra line breaks, replacing double or more newlines with a single one
  content = content.replace(/\n{2,}/g, '\n'); 

  content = content.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');

  // Wrap standalone LaTeX expressions (e.g., \frac, \pm) with $ for inline math
  content = content.replace(/\\\((.*?)\\\)/g, '$$$1$$'); // Inline math 

  return content;
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
      >
          {processContent(content)}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';