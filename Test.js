import {Guard} from './Guard.js'
import {Guards} from './Source/Guards.js'

export const GUARD=[
    {
            "isStr":"isString"

    },
    {
            'isStr':[
                    {
                            'isStr':"isStringIsString"
                    },

                    {
                            'isStr':[
                                    {
                                        'isInt':'isStringIsStringIsInt'
                                    }
                            ]
                    },
                    {
                            'isInt':[
                                    {
                                        'isStr':'isStringIsIntIsString'
                                    }
                            ]

                    },
                    {
                            'isEnc':{
                                    'DEFAULT':'utf8',
                                    'FUNCTION': 'isStringIsEncoding'
                            }
                    },

                    {
                            'isEncArr':'isStringIsEncodingArray'
                    }   
            ]
    },
    {
            'isInt':[
                    {
                            'isInt': {
                                'DEFAULT':10,
                                'FUNCTION': 'isIntegerIsInteger'
                            }    
                    },
                    {
                            'isStr':{
                                "DEFAULT":"",
                                "FUNCTION": 'isIntegerIsString'
                            }
                    },
                    {
                            'isIntArr':{
                                "DEFAULT":[],
                                "FUNCTION": 'isIntegerIsIntegerArray'
                            }
                    },
                    {
                            'isArr':[
                                    {
                                        'isArray':"isIntegerIsArrayIsArray"
                                    },
                                    {
                                        'isString':"isIntegerIsArrayIsString"
                                    }
                            ]
                    },
        ]   
    },
    {
            'isArr':'isStringIsSeparatorIsEncoding' 
    }
]

class TestObj{
    constructor(...v){
        new Guard(new Guards(), v, GUARD,  this)
    }

    isString(...v){

        console.log("isString(", v, ")")

    }

    isStringIsString(...v){
        console.log("isStringIsString(", v, ")")

    }

    isStringIsStringIsInt(...v){
        console.log("isStringIsStringIsInt(", v, ")")

    }

    isStringIsIntIsString(...v){
        console.log("isStringIsIntIsString(", v, ")")

    }

    isStringIsIntIsInt(...v){
        console.log("isStringIsIntIsInt(", v, ")")
    }

    isStringIsEncoding(...v){
        console.log("isStringIsEncoding(", v, ")")
    }

    isStringIsSeparatorIsEncoding(...v){
        console.log("isStringIsSeparatorIsEncoding(", v, ")")
    }
    
    isStringIsSeparatorIsEncoding(...v){
        console.log("isStringIsEncodingIsInt(", v, ")")
    }
    isIntegerIsInteger(...v){
        console.log("isIntegerIsInteger(", v, ")")

    }
}

class Test{
    constructor(){
        this.constructorTests()
    }

    constructorTests(){
        new TestObj('someString')
        // new TestObj('string1', 'string2')
        // new TestObj('string1', 'string2', 4)
        // new TestObj('string1', 5, 'string2')
        // new TestObj(2, null)
        // new TestObj(2, 4)
        // new TestObj(2, "somestring")
        //new TestObj(2, [1, 2, 3, 4])
        // new TestObj(2, ['1', '2', 3, 4])

        // new TestObj('string1', 4, 5)
        // new TestObj('string1', 'utf8')
        // new TestObj('string1', 'sep:,', 'utf8')
        // new TestObj('string1', 'utf8', 3)
    }
}

new Test()
