import { motion } from 'framer-motion'
import MathRenderer from '@/components/ui/MathRenderer'
import { cn } from '@/lib/utils'
import { KNOWLEDGE_CONTENT } from '@/data/knowledge'
import type { KnowledgeBlock } from '@/data/knowledge'
import type { StepId } from '@/types'

interface KnowledgeDetailProps {
  stepId: StepId
}

function renderBlock(block: KnowledgeBlock, blockIdx: number) {
  switch (block.type) {
    case 'heading':
      return (
        <h3
          key={blockIdx}
          className="text-lg font-semibold text-[#e2b04a] font-[Crimson_Text,_Georgia,_serif] mt-6 mb-3"
        >
          {block.text}
        </h3>
      )

    case 'text':
      return (
        <p
          key={blockIdx}
          className="leading-relaxed text-white/70 font-[IBM_Plex_Sans,_system-ui,_sans-serif] my-3"
        >
          {block.text}
        </p>
      )

    case 'formula':
      return (
        <div
          key={blockIdx}
          className="my-4 rounded-lg bg-[#1a1a2e]/80 border border-[#e2b04a]/10 p-4"
        >
          {block.formula && <MathRenderer math={block.formula} displayMode />}
          {block.caption && (
            <p className="mt-2 text-xs text-gray-500 text-center">{block.caption}</p>
          )}
        </div>
      )

    case 'math':
      return (
        <div key={blockIdx} className="my-3">
          {block.formula && <MathRenderer math={block.formula} displayMode />}
          {block.text && !block.formula && (
            <MathRenderer math={block.text} displayMode />
          )}
        </div>
      )

    case 'example':
      return (
        <div
          key={blockIdx}
          className="my-4 rounded-lg bg-[#4ecdc4]/10 border-l-4 border-[#4ecdc4] p-4 pl-5"
        >
          <span className="text-sm font-semibold text-[#4ecdc4] mb-2 block">
            📝 例
          </span>
          {block.formula && <MathRenderer math={block.formula} displayMode />}
          {block.caption && (
            <p className="mt-2 text-sm text-gray-400">{block.caption}</p>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function KnowledgeDetail({ stepId }: KnowledgeDetailProps) {
  const entry = KNOWLEDGE_CONTENT[stepId]

  if (!entry || !entry.sections || entry.sections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-white/10 p-8 text-center"
      >
        <div className="text-4xl mb-4">📖</div>
        <h3 className="text-xl font-semibold text-[#e2b04a] font-[Crimson_Text,_Georgia,_serif] mb-2">
          内容正在建设中
        </h3>
        <p className="text-gray-400 text-sm">
          知识详解内容正在持续更新中，敬请期待
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 space-y-6"
    >
      {entry.sections.map((section, sectionIdx) => (
        <section
          key={sectionIdx}
          className="bg-card rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-xl font-bold font-[Crimson_Text,_Georgia,_serif] mb-4 flex items-start gap-3">
            <span className="text-[#e2b04a] text-2xl font-bold shrink-0">
              {sectionIdx + 1}.
            </span>
            <span className="text-[#e2b04a]">{section.title}</span>
          </h2>
          <div className="space-y-1">
            {section.content.map((block, blockIdx) => renderBlock(block, blockIdx))}
          </div>
        </section>
      ))}
    </motion.div>
  )
}
