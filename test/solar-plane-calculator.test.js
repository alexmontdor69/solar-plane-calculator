// https://www.freecodecamp.org/news/how-to-start-unit-testing-javascript/

const SolarPlaneCalculator = require("../solar-plane-calculator");
const {value} = require("./testValue")

test.todo('get Ref Mode Shape')

test.todo('test rotation Matrix')
test.todo('test if there is a model width and a model height')

describe('Initiate SolarPlaceCalculator Class', ()=>{

    test("should create a reference Model", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        
        const pointNumber = model.points.length
        // Check the dimension of the refModel
        expect(calculator.refModel).toHaveLength(pointNumber)
        expect(calculator.refModel[0]).toHaveLength(4)
    });
})

describe('User requests', ()=>{

    test("should return formated model points", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        const pointNumber = model.points.length
        
        let points = calculator.getPoints()
        //points=[{x:2,y:3,z:3,label:""},{x:"2",y:3,z:3,label:""}]
        // Check the dimension of the refModel
        expect(points).toHaveLength(pointNumber)
        for (let inc=0; inc<points.length;inc++)
            expect(points[inc]).toEqual(expect.objectContaining({
                x: expect.any(Number),
                y: expect.any(Number),
                z: expect.any(Number),
                label: expect.any(String)})
                ) 
    });

    test("should set object Angle", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        
        calculator.setObjAzimuth(Math.PI)
       
        // Check the dimension of the refModel
        expect(calculator.objAzimuth).not.toEqual(objAzimuth)
        expect(calculator.objAzimuth).toEqual(Math.PI)

    });
    test("should set RefModel", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        
        calculator.setSunAzimuth(Math.PI)
       
        // Check the dimension of the refModel
        expect(calculator.sunAzimuth).not.toEqual(sunAzimuth)
        expect(calculator.sunAzimuth).toEqual(Math.PI)

    });
    test("should set sun Elevation", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        
        calculator.setElevation(Math.PI/6)
       
        // Check the dimension of the refModel
        expect(calculator.elevation).not.toEqual(elevation)
        expect(calculator.elevation).toEqual(Math.PI/6)

    });

    test("should get scaled RefModel By Unit", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const pointNumber = model.points.length
        
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        const refModel = calculator.refModel
        const ratio = 0.5 // by manual calculation
        const unit = 0.5
        const scaledRefModel = calculator.getRefModelByUnit(unit) //the unit here is 0.5 compare to 1

        
        // Check the dimension of the refModel
        expect(scaledRefModel).toHaveLength(pointNumber)
        for (let inc=0; inc<scaledRefModel.length;inc++){
            expect(scaledRefModel[inc]).toEqual(expect.objectContaining({
                    x: expect.any(Number),
                    y: expect.any(Number),
                    z: expect.any(Number),
            //    label: expect.any(String)
                })
            )
            
            expect(scaledRefModel[inc].x).toEqual(refModel[inc][0][0]*ratio)
            expect(scaledRefModel[inc].y).toEqual(refModel[inc][1][0]*ratio)
            expect(scaledRefModel[inc].z).toEqual(refModel[inc][2][0]*ratio)
        }

    });
    test("should get scaled RefModel By Ratio", () => {
        const {model, objAzimuth, sunAzimuth, elevation}={... value}
        const pointNumber = model.points.length
        
        const calculator=new SolarPlaneCalculator(model,objAzimuth, sunAzimuth, elevation)
        const refModel = calculator.refModel
        const ratio = 0.5 // by choice
        const scaledRefModel = calculator.getRefModelByRatio(ratio) //the unit here is 0.5 compare to 1
        
        // Check the dimension of the refModel
        expect(scaledRefModel).toHaveLength(pointNumber)
        for (let inc=0; inc<scaledRefModel.length;inc++){
            expect(scaledRefModel[inc]).toEqual(expect.objectContaining({
                    x: expect.any(Number),
                    y: expect.any(Number),
                    z: expect.any(Number),
            //    label: expect.any(String)
                })
            )
            
            expect(scaledRefModel[inc].x).toEqual(refModel[inc][0][0]*ratio)
            expect(scaledRefModel[inc].y).toEqual(refModel[inc][1][0]*ratio)
            expect(scaledRefModel[inc].z).toEqual(refModel[inc][2][0]*ratio)
        }

    });
})