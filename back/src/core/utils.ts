import {OutgoingHttpHeaders} from "http";

export class Header {
    public readonly name:string;
    public readonly value:string;


    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

const objectifyHeadersArray = function (headers:Array<Header>):OutgoingHttpHeaders {
    let result:OutgoingHttpHeaders = {};
    for(let header of headers){
        if(header !== null){
            result[header.name] = header.value;
        }
    }
    return result;
};

export { objectifyHeadersArray }