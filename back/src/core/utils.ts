import {OutgoingHttpHeaders} from "http";
import moment from "moment";
import isNumeric from "validator/lib/isNumeric";

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
const isEmptyString = function(str:string): boolean{
    return str === undefined || str === null || str.trim() === ""
};

/*** Check if an array is an array of Number ***/
const isNumericArray = function(arr:Array<any>): boolean{
    for(let e of arr){
        if(!isNumeric(e)){
            return false;
        }
    }
   return true;
};

/*** Check if a string is a valid date***/
const isDateValid = function (date:string): boolean {
    return moment(date).isValid();
};

/*** Convert a string representing a datetime to a date***/
const convertStringToDate = function (date:string):Date {
    return moment(date).toDate();
};


/*** Check if a string is a valid date***/
const isDateTimeAfter = function (date:string, dateBefore:string) {
    const end = moment(date);
    const start = moment(dateBefore);
    return end.isAfter(start);
};

export { objectifyHeadersArray, isEmptyString, isDateValid, isNumericArray, isDateTimeAfter, convertStringToDate  }