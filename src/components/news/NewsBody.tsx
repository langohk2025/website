import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 font-inter text-base leading-7 text-[#6a7282]">{children}</p>,
    h2: ({ children }) => <h2 className="mb-3 mt-8 font-poppins text-2xl text-[#101828]">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 mt-6 font-poppins text-xl text-[#101828]">{children}</h3>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-brand-500 underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

type NewsBodyProps = {
  value?: PortableTextBlock[]
}

export function NewsBody({ value }: NewsBodyProps) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
