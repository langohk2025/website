import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Public IDs — must be hardcoded for hosted Studio builds (Vite won't read .env.local).
const projectId = 'qlkxh8uz'
const dataset = 'production'

export default defineConfig({
  name: 'lango-website',
  title: 'Lango Website',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
