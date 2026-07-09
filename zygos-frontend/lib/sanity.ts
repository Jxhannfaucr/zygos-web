// Ruta: lib/sanity.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '2lv2d44o',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})