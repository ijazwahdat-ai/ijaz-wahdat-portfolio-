'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from 'firebase/auth'
import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import SecretGateModal from './SecretGateModal'
import { SiteConfig } from '@/lib/portfolio-types'

const DynamicStudioWorkspace = dynamic(() => import('@/components/studio/StudioWorkspace'), {
  ssr: false,
})

interface FooterProps {
  siteConfig?: SiteConfig
  authorName?: string
}

const REQUIRED_TAPS = 5
const HOLD_DURATION_MS = 10000

export default function Footer({ siteConfig, authorName }: FooterProps) {
  const router = useRouter()
  const [gateOpen, setGateOpen] = useState(false)
  const [unlockedSession, setUnlockedSession] = useState<{
    user: User
    bearerToken: string
  } | null>(null)

  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heldOpenedRef = useRef(false)

  const displayAuthor = authorName || siteConfig?.siteTitle || siteMetadata.author
  const displayTitle = siteConfig?.siteTitle || siteMetadata.title
  const email = siteConfig?.contactEmail || siteMetadata.email
  const github = siteConfig?.github ?? siteMetadata.github
  const linkedin = siteConfig?.linkedin ?? siteMetadata.linkedin
  const twitter = siteConfig?.twitter ?? siteMetadata.twitter

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    }
  }, [])

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const handlePointerDown = () => {
    clearHoldTimer()
    heldOpenedRef.current = false
    holdTimerRef.current = setTimeout(() => {
      heldOpenedRef.current = true
      tapCountRef.current = 0
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
      setGateOpen(true)
    }, HOLD_DURATION_MS)
  }

  const handleSecretTap = () => {
    if (heldOpenedRef.current) {
      heldOpenedRef.current = false
      return
    }
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    if (tapCountRef.current >= REQUIRED_TAPS) {
      tapCountRef.current = 0
      clearHoldTimer()
      setGateOpen(true)
      return
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0
    }, 1800)
  }

  const handleUnlocked = useCallback((user: User, bearerToken: string) => {
    setGateOpen(false)
    setUnlockedSession({ user, bearerToken })
  }, [])

  const handleLockStudio = useCallback(() => {
    setUnlockedSession(null)
    router.refresh()
  }, [router])

  return (
    <>
      <footer>
        <div className="mt-16 flex flex-col items-center">
          <div className="mb-3 flex space-x-4">
            <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} size={6} />
            <SocialIcon kind="github" href={github} size={6} />
            <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
            <SocialIcon kind="linkedin" href={linkedin} size={6} />
            <SocialIcon kind="twitter" href={twitter} size={6} />
            <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
            <SocialIcon kind="x" href={siteMetadata.x} size={6} />
            <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
            <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
            <SocialIcon kind="medium" href={siteMetadata.medium} size={6} />
          </div>
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div>{displayAuthor}</div>
            <div>{` • `}</div>
            <button
              type="button"
              onClick={handleSecretTap}
              onPointerDown={handlePointerDown}
              onPointerUp={clearHoldTimer}
              onPointerLeave={clearHoldTimer}
              onPointerCancel={clearHoldTimer}
              onContextMenu={(e) => e.preventDefault()}
              className="cursor-default touch-manipulation select-none focus:outline-none"
              aria-label={`Copyright ${new Date().getFullYear()}`}
            >
              {`© ${new Date().getFullYear()}`}
            </button>
            <div>{` • `}</div>
            <Link href="/">{displayTitle}</Link>
          </div>
          {siteConfig?.footerTagline && (
            <div className="mb-8 text-center text-xs text-gray-400 dark:text-gray-500">
              {siteConfig.footerTagline}
            </div>
          )}
        </div>
      </footer>

      <SecretGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onUnlocked={handleUnlocked}
      />

      {unlockedSession && (
        <div
          className="fixed inset-0 z-90 overflow-y-auto bg-gray-50 dark:bg-gray-950"
          role="region"
          aria-label="Portfolio Admin Panel"
        >
          <DynamicStudioWorkspace
            user={unlockedSession.user}
            bearerToken={unlockedSession.bearerToken}
            onLockStudio={handleLockStudio}
          />
        </div>
      )}
    </>
  )
}
