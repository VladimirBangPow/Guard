import { GuardUtils } from "./Utils.js"
import { GuardGen } from "./Gen.js"
import * as assert from "node:assert"

export class Test{
    constructor(h, w, guardFuncBag){
        this.h=h
        this.w=w
        this.test=this
        this.guardFuncBag=guardFuncBag
        this.utils = new GuardUtils(guardFuncBag)
        this.tests()
        
    }

    tests(){
        // this.defaultValueTestAndAllBlockTests()
        // this.getterTests()
        // this.genTests()
        // this.evalTests()
        this.guardTests()
    }

    guardTests(){
        //generate schema
        //test guard on all paths in the schema with paramters to match
        var gg = new GuardGen(this.h, this.w, this.guardFuncBag)
        var ggen = gg.ggen
        this.utils.verify(ggen)
        this.utils.log(ggen)    
    }

    

    getterTests(){
        var obj;
        //getGuard uses getGuardObj()
        for(var i =0; i<10000; i++){
            obj = this.utils.new.RecursiveDefaultBlockObj()  
            assert.equal(this.guardFuncBag.includes(this.utils.get.GuardKey(obj)), true)

            obj = this.utils.new.RecursiveTypeBlockObj()
            assert.equal(this.guardFuncBag.includes(this.utils.get.GuardKey(obj)), true)

            obj = this.utils.new.TerminalTypeBlockObj()
            assert.equal(this.guardFuncBag.includes(this.utils.get.GuardKey(obj)), true)

            obj = this.utils.new.TerminalDefaultBlockObj()
            assert.equal(this.guardFuncBag.includes(this.utils.get.GuardKey(obj)), true)
        }

        for(var i =0; i<10000; i++){
            obj = this.utils.new.RecursiveDefaultBlockObj()
            obj[this.utils.get.GuardKey(obj)].push(this.utils.new.RecursiveDefaultBlockObj())
            var newObj = this.utils.get.NextRecursiveBlockObj(obj)
            assert.notEqual(obj, newObj)
            assert.notDeepEqual(obj, newObj)
            assert.equal(this.utils.is.RecursiveBlockObj(newObj[0]), true)
        }
    }

    genTests(){
        for(var i =0; i<10000; i++){
            var gg = new GuardGen(this.h, this.w, this.guardFuncBag)
            var ggen = gg.ggen
            //this.utils.log(ggen)    
            this.utils.verify(ggen)
        }
    }

    evalTests(){
        var someFunc=(v)=>{
            var result=0;
            for(var i = 0; i<v.length; i++){
                result+=v[i]
            }
            return this.utils.guards.isInt(result)
        }
        for(var i =0; i<1000; i++){
            this.guardFuncBag.forEach(func => {
                assert.equal(true, this.utils.is.Guard(func))
                assert.equal(true, this.utils.passGuard(func, this.utils.defaultVal(func)))
                assert.equal(true, eval(this.utils.buildParams('someFunc', this.utils.rg.randIntArr(10))))
            });
        }      
    }
    defaultValueTestAndAllBlockTests(){
        this.test.NewRecursiveTypeBlockObj()
        this.test.NewRecursiveDefaultBlockObj()
        this.test.NewTerminalTypeBlockObj()
        this.test.TerminalDefaultBlockObj()
    }



    IsRecursiveTypeBlockObj(){
        var obj = this.utils.new.RecursiveTypeBlockObj();
        assert.equal(this.utils.is.RecursiveTypeBlockObj(obj), true);
        return true
    }

    IsRecursiveDefaultBlockObj(){
        var obj = this.utils.new.RecursiveDefaultBlockObj();
        assert.equal(this.utils.is.RecursiveDefaultBlockObj(obj), true);
        return true
    }

    IsTerminalTypeBlockObj(){
        var obj = this.utils.new.TerminalTypeBlockObj()
        assert.equal(this.utils.is.TerminalTypeBlockObj(obj), true);
        return true
    }

    IsTerminalDefaultBlockObj(){
        var obj = this.utils.new.TerminalDefaultBlockObj()
        assert.equal(this.utils.is.TerminalDefaultBlockObj(obj), true);
        return true
    }

    NewRecursiveTypeBlockObj(){
        for(var i=0; i<10000; i++){
            assert.equal(this.test.IsRecursiveTypeBlockObj(), true)
        }
        return true
    }

    NewRecursiveDefaultBlockObj(){
        for(var i=0; i<10000; i++){
            assert.equal(this.test.IsRecursiveDefaultBlockObj(), true)
        }
        return true
    }

    NewTerminalTypeBlockObj(){
        for(var i=0; i<10000; i++){
            assert.equal(this.test.IsTerminalTypeBlockObj(), true)
        }
        return true
    }

    TerminalDefaultBlockObj(){
        for(var i=0; i<10000; i++){
            assert.equal(this.test.IsTerminalDefaultBlockObj(), true)
        }
        return true
    }
    Guard(){
        return (test_case, guard, func, expectedResult)=>{
            eval(
                `class Whatever{
                    constructor(test_case, guard, expected_result){
                        this.expectedResult=expected_result
                        new Guard(new Guards(), test_case, guard,  this)
                        //console.log(${func})
                    }
                    ${func}(guardInputs){
                        assert.deepEqual(guardInputs, this.expectedResult)
                        console.log(func+"("+ JSON.stringify(this.expectedResult)+')', 'PASSES')
                    }
                } 
                new Whatever(${test_case}, ${guard}, ${expectedResult})
                `
            )
        }
    }
}
var guardFuncBag=['isStr', 'isInt', 'isArr', 'isIntArr', 'isEnc', 'isEncArr', 'isStrArr', 'isObj', 'isObjArr']
new TestUtils(3, 3, guardFuncBag);