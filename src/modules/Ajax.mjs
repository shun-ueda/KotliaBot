import pkg from 'xmlhttprequest';
const { XMLHttpRequest } = pkg;
import logpkg from 'logplease';
const logger = logpkg.create('utils');
export const get=(urlGet)=>{
    let result;
    let request = new XMLHttpRequest();
    request.open('GET',urlGet,false);
    request.onreadystatechange = () => {
        result = request.responseText;
    };
    request.send(null); 
    return result;
};