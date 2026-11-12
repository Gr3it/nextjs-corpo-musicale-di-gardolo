"use client"

import { itITLocale } from "@sanity/locale-it-it"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schemaTypes, singletonNames } from "./sanity/schemaTypes"
import { structure } from "./sanity/structure"

export default defineConfig({
  basePath: "/studio",
  title: "Corpo Musicale di Gardolo",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Le pagine uniche non si possono creare da "Nuovo documento".
    templates: (templates) => templates.filter(({ schemaType }) => !singletonNames.has(schemaType)),
  },
  document: {
    // Le pagine uniche non si possono duplicare né eliminare.
    actions: (actions, { schemaType }) =>
      singletonNames.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion }), itITLocale()],
})
