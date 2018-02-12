import { OrderBy } from './order-by.model';
import { Paging } from './paging.model';
import { SearchCriteriaFilter } from './search-criteria-filter.model';

export interface SearchCriteria {
    id?: number;
    filterText?: String;
    filters?: Array<SearchCriteriaFilter>;
    orders?: Array<OrderBy>;
    paging?: Paging;
}
