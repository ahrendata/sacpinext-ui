import { SearchCriteriaFilterOperator } from './search-criteria-filter-operator.model';

export class SearchCriteriaFilter {
    name: string;
    value: any;
    type: string;
    operator: string;

    alias: string;

    constructor(name: string, value: any, operator: string, type?: string) {
        this.name = name;
        this.value = value;
        this.operator = operator;
        this.type = type;
    }

}
