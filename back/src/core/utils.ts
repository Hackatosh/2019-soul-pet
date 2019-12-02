import {OutgoingHttpHeaders} from "http";

/*** Class representing a HTTP header ***/
export class HttpHeader {
    public readonly name:string;
    public readonly value:string;


    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

/*** Flattens a list of HTTPHeader object into a OutgoingHttpHeaders***/
const objectifyHeadersArray = function (headers:Array<HttpHeader>):OutgoingHttpHeaders {
    let result:OutgoingHttpHeaders = {};
    for(let header of headers){
        if(header !== null){
            result[header.name] = header.value;
        }
    }
    return result;
};

/*** Check if a string is invalid or empty ***/
const isEmptyString = function(str:string){
    return str === undefined || str === null || str.trim() === ""
};

export { objectifyHeadersArray, isEmptyString }