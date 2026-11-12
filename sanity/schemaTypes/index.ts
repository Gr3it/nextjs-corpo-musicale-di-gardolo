import { event, eventType } from "./event"
import { objectTypes } from "./objects"
import { singletonTypes } from "./singletons"
import { trasparenzaDoc } from "./trasparenza"

export { singletonNames } from "./singletons"

export const schemaTypes = [...objectTypes, ...singletonTypes, event, eventType, trasparenzaDoc]
