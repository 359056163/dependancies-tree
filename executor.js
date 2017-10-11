"use strict";
const fs = require("fs");
const path = require("path");
const esprima = require('esprima');
const config = require('./config');

function find(text){
   let tokens = esprima.tokenize(text);
   let result = [];
   tokens.forEach((line,index,arr)=>{
       let bracket1 = arr[index+1];
       let phrase = arr[index+2];
       let bracket2 = arr[index+3];
       if(line.type == 'Identifier' && line.value == 'require' && bracket1.type == "Punctuator" && bracket1.value == "(" && bracket2.type == "Punctuator" && bracket2.value == ")" && phrase.type == 'String'){
           result.push(phrase.value.replace(/[\'\"]/g,""));
       }
   });
   return result;
}

function parseFile(filename) {
    let text = fs.readFileSync(filename).toString();
    let matchRst = find(text);
    let dependancies = [];

    if(matchRst && matchRst.length){
        let phraseSet = new Set(matchRst);
        dependancies = Array.from(phraseSet);
    }

    return dependancies;
}
module.exports = {
    execute:(moduleName)=>{
        let stack = [];
        let root = {
            filename:require.resolve(moduleName),
        }
        stack.push(root);

        while(stack.length>0){
            let target = stack.pop();
            let dependancies = parseFile(target.filename);
            if(dependancies.length>0){
                target.dependancies = dependancies.map((module)=>{
                    let filename = "";
                    if(config.nativeModules.has(module)){// node.js 内置模块
                        return {
                            filename:`${module}(native module)`,
                        }
                    }else if(module.startsWith(".")||module.startsWith("/")){ //模块内部依赖
                        filename =  require.resolve( path.resolve( path.dirname(target.filename),module))
                    }else{                                      //外部模块
                        filename = require.resolve(module);
                    }
                    let file = {
                        filename:filename,
                    };
                    stack.push(file);
                    return file;
                })
            }else{
                target.dependancies = []
            }
        }
        return root;
    }
}
