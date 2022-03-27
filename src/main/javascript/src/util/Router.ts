const API = '/api';
const STOCK = '/stock';
const PARSER = '/parser';
const CSV = '/csv'

export const addRoute = (name: string) => API + name;
export const stockRoute = addRoute(STOCK);
export const addParserRoute = (ext:string) => addRoute(PARSER) + ext;
export const csvParserRoute = addParserRoute(CSV);