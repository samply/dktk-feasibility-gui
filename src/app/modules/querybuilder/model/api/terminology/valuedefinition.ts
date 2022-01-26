import { TerminologyCode } from './terminology'
import { QuantityUnit } from '../query/valueFilter'
import { TimeRestrictionType } from '../query/timerestriction'

export abstract class ValueDefinition {
  type: ValueType

  display?: string

  precision = 1
  max?: number
  min?: number
  allowedUnits?: QuantityUnit[] = []

  dateType?: TimeRestrictionType
  minDate?: Date // implicitly included date
  maxDate?: Date // implicitly included date
  beforeDate?: Date
  afterDate?: Date

  inputString?: string

  selectableConcepts?: TerminologyCode[]
}

export abstract class AttributeDefinition {
  type: ValueType
  attributeCode: TerminologyCode
  display?: string
  optional?: boolean

  precision = 1
  max?: number
  min?: number
  allowedUnits?: QuantityUnit[] = []

  selectableConcepts?: TerminologyCode[]
}

export enum ValueType {
  QUANTITY = 'quantity',
  CONCEPT = 'concept',
  DATE = 'date',
  STRING = 'string',
}
