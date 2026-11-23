'use client'

import SectionContainer from './SectionContainer'

interface PublicChromeWrapperProps {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

export default function PublicChromeWrapper({
  header,
  footer,
  children,
}: PublicChromeWrapperProps) {
  return (
    <SectionContainer>
      {header}
      <main className="mb-auto">{children}</main>
      {footer}
    </SectionContainer>
  )
}
