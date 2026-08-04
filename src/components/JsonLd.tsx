type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Server-safe JSON-LD script tag for schema.org structured data. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
