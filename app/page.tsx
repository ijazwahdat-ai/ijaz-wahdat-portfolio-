import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { getLivePortfolioSnapshot } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const livePortfolio = await getLivePortfolioSnapshot()
  return <Main posts={posts} livePortfolio={livePortfolio} />
}
