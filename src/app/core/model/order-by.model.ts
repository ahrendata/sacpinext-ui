export class OrderBy {
    ascending: boolean;
    name: string;

    constructor(name: string, ascending?: boolean) {
        this.name = name;
        this.ascending = ascending !== undefined ? ascending : true;
    }

}
