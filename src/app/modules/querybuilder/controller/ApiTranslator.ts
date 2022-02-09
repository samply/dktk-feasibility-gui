import { Query, QueryOnlyV1, QueryOnlyV2 } from '../model/api/query/query'
import { Criterion, CriterionOnlyV1, CriterionOnlyV2 } from '../model/api/query/criterion'
import { ObjectHelper } from './ObjectHelper'
import { OperatorOptions } from '../model/api/query/valueFilter'
import { TimeRestrictionType } from '../model/api/query/timerestriction'

// translates a query with groups to the agreed format of queries in version 1 (without groups)
export class ApiTranslator {
  translateToV1(query: Query): QueryOnlyV1 {
    const result = new QueryOnlyV1()

    result.display = query.display
    const exclusionCriteria = ObjectHelper.clone(query.groups[0].exclusionCriteria)
    const inclusionCriteria = ObjectHelper.clone(query.groups[0].inclusionCriteria)

    result.inclusionCriteria = this.translateCritGroupV1(inclusionCriteria)

    if (exclusionCriteria.length > 0) {
      result.exclusionCriteria = this.translateCritGroupV1(exclusionCriteria)
    } else {
      result.exclusionCriteria = undefined
    }

    return result
  }

  private translateCritGroupV1(inclusionCriteria: Criterion[][]): CriterionOnlyV1[][] {
    const result: CriterionOnlyV1[][] = []
    inclusionCriteria.forEach((criterionArray) => {
      const innerArrayV1: CriterionOnlyV1[] = []
      criterionArray.forEach((criterion) => {
        const criterionV1 = new CriterionOnlyV1()
        criterionV1.termCode = criterion.termCodes[0]
        criterionV1.timeRestriction = criterion.timeRestriction
        if (criterion.valueFilters.length > 0) {
          criterionV1.valueFilter = criterion.valueFilters[0]
          if (criterionV1.valueFilter.type === 'date') {
            criterionV1.valueFilter.minDate = criterionV1.valueFilter.valueDefinition.minDate
            criterionV1.valueFilter.maxDate = criterionV1.valueFilter.valueDefinition.maxDate
          }
          criterionV1.valueFilter.valueDefinition = undefined
        }

        this.editTimeRestrictions(criterionV1.timeRestriction)
        this.editTimeRestrictions(criterionV1.valueFilter)
        this.removeNonApiFieldsV1(criterionV1)
        innerArrayV1.push(criterionV1)
      })
      result.push(innerArrayV1)
    })

    return result
  }

  // noinspection JSMethodCanBeStatic
  private editTimeRestrictions(temp: any): void {
    if (temp) {
      if (temp.minDate) {
        temp.beforeDate = new Date()
        temp.afterDate = new Date()
        const minTemp = new Date(temp.minDate)
        const maxTemp = new Date(temp.maxDate)

        switch (temp.tvpe) {
          case TimeRestrictionType.AFTER: {
            temp.afterDate.setDate(minTemp.getDate() + 1)
            temp.beforeDate = undefined
            break
          }
          case TimeRestrictionType.AFTER_OR_AT: {
            temp.afterDate.setDate(minTemp.getDate())
            temp.beforeDate = undefined
            break
          }
          case TimeRestrictionType.BEFORE: {
            temp.beforeDate.setDate(minTemp.getDate() - 1)
            temp.afterDate = undefined
            break
          }
          case TimeRestrictionType.BEFORE_OR_AT: {
            temp.beforeDate.setDate(minTemp.getDate())
            temp.afterDate = undefined
            break
          }
          case TimeRestrictionType.AT: {
            temp.beforeDate.setDate(minTemp.getDate())
            temp.afterDate.setDate(minTemp.getDate())
            break
          }
          case TimeRestrictionType.NOT_AT: {
            temp.beforeDate.setDate(minTemp.getDate() - 1)
            temp.afterDate.setDate(minTemp.getDate() + 1)
            break
          }
          case TimeRestrictionType.BETWEEN: {
            if (temp.maxDate) {
              temp.beforeDate.setDate(maxTemp.getDate())
              temp.afterDate.setDate(minTemp.getDate())
            } else {
              temp.beforeDate = undefined
              temp.afterDate = undefined
            }
            break
          }
        }
      }
      temp.tvpe = undefined
      temp.minDate = undefined
      temp.maxDate = undefined
    }
  }
  // noinspection JSMethodCanBeStatic
  private removeNonApiFieldsV1(criterion: CriterionOnlyV1): void {
    if (criterion.valueFilter) {
      // criterion.valueFilter.valueDefinition = null
      criterion.valueFilter.max = undefined
      criterion.valueFilter.min = undefined
      criterion.valueFilter.precision = undefined

      if (criterion.valueFilter.type === OperatorOptions.CONCEPT) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.unit = undefined
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_RANGE) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_COMPARATOR) {
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      }
    }
  }

  translateToV2(query: Query): QueryOnlyV2 {
    const result = new QueryOnlyV2()

    result.display = query.display
    const exclusionCriteria = ObjectHelper.clone(query.groups[0].exclusionCriteria)
    const inclusionCriteria = ObjectHelper.clone(query.groups[0].inclusionCriteria)

    result.inclusionCriteria = this.translateCritGroupV2(inclusionCriteria)

    if (exclusionCriteria.length > 0) {
      result.exclusionCriteria = this.translateCritGroupV2(exclusionCriteria)
    } else {
      result.exclusionCriteria = undefined
    }

    return result
  }

  private translateCritGroupV2(inclusionCriteria: Criterion[][]): CriterionOnlyV2[][] {
    const result: CriterionOnlyV2[][] = []
    inclusionCriteria.forEach((criterionArray) => {
      const innerArrayV2: CriterionOnlyV2[] = []
      criterionArray.forEach((criterion) => {
        const criterionV2 = new CriterionOnlyV2()
        criterionV2.termCodes = criterion.termCodes
        criterionV2.timeRestriction = criterion.timeRestriction
        if (criterion.valueFilters.length > 0) {
          criterionV2.valueFilter = criterion.valueFilters[0]
          criterionV2.valueFilter.valueDefinition = undefined
        }
        if (criterion.attributeFilters?.length > 0) {
          criterion.attributeFilters.forEach((attribute) => {
            if (attribute.type === OperatorOptions.CONCEPT) {
              if (attribute.selectedConcepts.length > 0) {
                criterionV2.attributeFilters.push(attribute)
              }
            } else {
              criterionV2.attributeFilters.push(attribute)
            }
            attribute.attributeCode = attribute.attributeDefinition.attributeCode
            attribute.attributeDefinition = undefined
          })
        }
        this.editTimeRestrictions(criterionV2.timeRestriction)
        this.removeNonApiFieldsV2(criterionV2)
        innerArrayV2.push(criterionV2)
      })
      result.push(innerArrayV2)
    })

    return result
  }

  // noinspection JSMethodCanBeStatic
  private removeNonApiFieldsV2(criterion: CriterionOnlyV2): void {
    if (criterion.valueFilter) {
      criterion.valueFilter.precision = undefined
      if (criterion.valueFilter.type === OperatorOptions.QUANTITY_COMPARATOR) {
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.maxValue = undefined
      }
      if (criterion.valueFilter.type === OperatorOptions.QUANTITY_RANGE) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.value = undefined
      }
    }
  }
}
