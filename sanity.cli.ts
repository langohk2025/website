import './sanity/env'
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'qlkxh8uz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'lango-website',
  deployment: {
    appId: 'sh2ydeqbycldecx1hjhj4ijr',
    autoUpdates: true,
  },
})
