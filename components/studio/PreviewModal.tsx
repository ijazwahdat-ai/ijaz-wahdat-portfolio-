'use client'

import { useState } from 'react'
import { Monitor, Smartphone, X, Globe } from 'lucide-react'
import PortfolioSections from '@/components/PortfolioSections'
import { LivePortfolioSnapshot } from '@/lib/portfolio-types'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  snapshot: LivePortfolioSnapshot
  onPublishFromPreview?: () => void
  publishing?: boolean
}

export default function PreviewModal({
  open,
  onClose,
  snapshot,
  onPublishFromPreview,
  publishing = false,
}: PreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-80 flex flex-col bg-gray-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Draft Portfolio Preview"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Draft Preview: {snapshot.activePresetName}</span>
          <span className="hidden text-xs text-gray-400 sm:inline">Not yet live on public URL</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 p-0.5">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`flex min-h-[36px] items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                viewport === 'desktop' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`flex min-h-[36px] items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                viewport === 'mobile' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {onPublishFromPreview && (
            <button
              type="button"
              onClick={onPublishFromPreview}
              disabled={publishing}
              className="bg-primary-600 hover:bg-primary-700 flex min-h-[38px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap text-white disabled:opacity-50"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{publishing ? 'Publishing...' : 'Publish Live'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-6 dark:bg-gray-950">
        <div
          className={`mx-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xl transition-all sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${
            viewport === 'mobile' ? 'max-w-[390px]' : 'max-w-5xl'
          }`}
        >
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {snapshot.siteConfig.headerTitle}
            </span>
            <div className="flex gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
              {snapshot.siteConfig.navLinks
                .filter((l) => l.visible && l.href !== '/')
                .map((l) => (
                  <span key={`${l.title}-${l.href}`}>{l.title}</span>
                ))}
            </div>
          </div>

          <PortfolioSections snapshot={snapshot} previewMode />
        </div>
      </div>
    </div>
  )
}
