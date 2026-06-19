import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const customStyle = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: '#040d16',
    border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.6',
  }
}

function VerdictBadge({ text }) {
  let cls = ''
  if (text.includes('ESCALATE')) cls = 'verdict-escalate'
  else if (text.includes('MONITOR')) cls = 'verdict-monitor'
  else if (text.includes('CLOSE') || text.includes('FALSE POSITIVE')) cls = 'verdict-close'

  if (!cls) return <p>{text}</p>
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-bold font-display tracking-widest ${cls}`}>
      {text}
    </div>
  )
}

export default function OutputRenderer({ content }) {
  return (
    <div className="nova-output">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            const text = String(children)
            if (text.includes('ESCALATE') || text.includes('MONITOR') || (text.includes('CLOSE') && text.includes('P'))) {
              return <VerdictBadge text={text} />
            }
            return <p>{children}</p>
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : 'bash'
            if (inline) {
              return <code className={className} {...props}>{children}</code>
            }
            return (
              <SyntaxHighlighter
                style={customStyle}
                language={lang}
                PreTag="div"
                customStyle={{ margin: '12px 0', borderRadius: '8px' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
          table({ children }) {
            return (
              <div style={{ overflowX: 'auto', margin: '12px 0' }}>
                <table>{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
