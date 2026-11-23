import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase-client'
import { DEFAULT_LIVE_SNAPSHOT } from './default-seed'
import { LivePortfolioSnapshot } from './portfolio-types'

export async function getLivePortfolioSnapshot(): Promise<LivePortfolioSnapshot> {
  try {
    const snapPromise = getDoc(doc(db, 'public_portfolio', 'live'))
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500))
    const snap = await Promise.race([snapPromise, timeoutPromise])
    if (snap && snap.exists()) {
      const data = snap.data() as Partial<LivePortfolioSnapshot>
      if (data && data.hero && data.about && data.sectionOrder && data.sectionVisibility) {
        return {
          ...DEFAULT_LIVE_SNAPSHOT,
          ...data,
          siteConfig: {
            ...DEFAULT_LIVE_SNAPSHOT.siteConfig,
            ...(data.siteConfig || {}),
          },
          hero: {
            ...DEFAULT_LIVE_SNAPSHOT.hero,
            ...(data.hero || {}),
          },
          about: {
            ...DEFAULT_LIVE_SNAPSHOT.about,
            ...(data.about || {}),
          },
          sectionVisibility: {
            ...DEFAULT_LIVE_SNAPSHOT.sectionVisibility,
            ...(data.sectionVisibility || {}),
          },
        }
      }
    }
  } catch {
    // Graceful fallback to initial snapshot when database is unseeded or unreachable
  }
  return DEFAULT_LIVE_SNAPSHOT
}
