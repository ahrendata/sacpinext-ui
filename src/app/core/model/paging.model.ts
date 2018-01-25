export class Paging {
    page: number;
    pageSize: number;

    constructor(page?: number, pageSize?: number) {
        this.page = page || 1;
        this.pageSize = pageSize || 10;
    }

}
