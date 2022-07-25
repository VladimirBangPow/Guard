export class Guard{
    constructor(guards, v, schema, obj, term=true){
        this.obj=obj
        this.term=term
        this.didTerminate=false
        this.g = guards
        this.guard(v, 0, schema)
    }

    guard(v, v_indx, schema){
        schema.forEach((schema_obj)=>{
            try {
                    if(this.didTerminate){return}
                    if(this.g.isObjArr(schema_obj)){
                        this.guard(v, v_indx+1, schema_obj)
                    }else if(this.g.isObj(schema_obj)){
                        if(this.g.isNKeys(schema_obj, 1)){
                            var func = Object.keys(schema_obj)[0];
                            var val = schema_obj[func];
                            if(this.g.isGuard(func)){
                                if(this.g.passGuard(func, v[v_indx])){
                                    if(this.isTerminal(v, v_indx, val)=='string'){
                                        this.terminatingStr(v, val);
                                    }else if(this.isTerminal(v, v_indx, val)=='obj'){
                                        this.terminatingObj(func, v, v_indx, val);
                                    }else{
                                        this.guard(v, v_indx+1, schema_obj[func]);
                                    }
                                }else{
                                    if(this.isTerminal(v, v_indx, val)=='obj'){
                                        this.terminatingObj(func, v, v_indx, val);
                                    }else{
                                        throw Error("did not pass guard and is not terminal object with default value")
                                    }
                                }
                            }else{throw Error("schema error:", schema_obj, "is not a guard object")}
                        }else{throw Error("Schema Error, multiple guard keys", Object.keys(schema_obj), "at same level")}
                    }else{throw Error("Schema Error:",schema_obj, "must be an object if its not an array but is not")}
            }catch(err){}
        })
        //flush the queue
        this.terminatingObj(null, null, null, null, false)
    }

    isTerminal(v, v_indx, val){
        if(this.g.isStr(val)&&(v_indx==v.length-1)){
            return 'string';
        }else if(this.g.isObj(val)&&(!this.g.isArr(val))&&(v_indx==v.length-1)){
            //deep check required!
            if(this.g.isKey(val,'DEFAULT')&&this.g.isKey(val, 'FUNCTION')){
                return 'obj';
            }
        }
    }

    terminatingObj(func, v, v_indx, obj, lookahead=true){
        if(!lookahead){
            try{
                if(this.q.length){
                    this.didTerminate=true
                    eval(this.q.shift())
                }else{
                    this.didTerminate=true
                    v.pop()
                    v.push(obj['DEFAULT'])
                    func = this.g.buildParams(obj['FUNCTION'], v)
                    eval('this.obj.'+func)
                }
            }catch{
                return
            }
            return
        }
        
        if(this.g.passGuard(func, v[v_indx])){
            this.didTerminate=true
            func = this.g.buildParams(obj['FUNCTION'], v)
            eval('this.obj.'+func)
        }else{
            v.pop()
            v.push(obj['DEFAULT'])
            func = this.g.buildParams(obj['FUNCTION'], v)
            if(lookahead){
                this.q.push('this.obj.'+func)
            }
        }

    }
    terminatingStr(v, str){
        this.didTerminate=true
        var func = this.g.buildParams(str, v)
        eval('this.obj.'+func)
    }
}