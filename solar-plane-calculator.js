
import convexHull from 'convex-hull';
import {transpose, multiply} from 'matrix-lib-js'


class SolarPlaneCalculator {

    constructor (model, objAzimuth, sunAzimuth, elevation){
        this.model = model
        this.sunAzimuth = sunAzimuth
        this.objAzimuth = objAzimuth
        this.elevation = elevation
        this.initSegment =[]
        this.initModel =[]
        this.points =[]
        // parsing Model
        this.init()

        this.rotationMatrix=this.buildRotationMatrix()
        this.transformedPoints=[]
        this.transformModel()
    }

    init(){
        console.log (`Init Model`)
        this.initSegment=this.model.segments
        this.initModel=this.model.points
        this.objConfig={
            width:this.model.width,
            depth:this.model.depth,
            height:this.model.height,
        }
        this.translationVector=[
            this.model.x0||0,
            this.model.y0||0,
            this.model.z0||0 ]
        console.log (`Create a reference ${this.initModel.length} points Model to dimension W, D, P`, 
            this.objConfig.width,
            this.objConfig.depth, 
            this.objConfig.height)
        
            this.rotateModel() // =>this.refModel
    }

    rotateModel (){
        console.log ('.. Adjust Object Position')
        const cosOAz=Math.cos(this.objAzimuth)
        const sinOAz=Math.sin(this.objAzimuth)

        // position as per aerial view
        let ZObj= [
            [cosOAz,-sinOAz,0,0],
            [sinOAz,cosOAz,0,0],
            [0,0,1,0],
            [0,0,0,1]];

        // translation to the symetrical axis
        const T=[
            [1,0,0,-this.translationVector[0]],
            [0,1,0,-this.translationVector[1]],
            [0,0,1,-this.translationVector[2]],
            [0,0,0,1]]

        const matrix = multiply(ZObj,T)

        this.refModel = this.initModel
                            .map(point=>({ 
                                            x:point.x*this.objConfig.width, 
                                            y:-point.y*this.objConfig.depth, 
                                            z:point.z*this.objConfig.height
                                        }))
                            .map(point=>([[point.x],[point.y],[point.z],[1]])) // refModel being an array of points vector 3x1
                            .map(point=>multiply(matrix,point))
    }

    buildRotationMatrix (){
        console.log ('.. Adjust Solar Plane in function of sun azimuth and elevation')

        const cosSAz=Math.cos(this.sunAzimuth)
        const sinSAz=Math.sin(this.sunAzimuth)
        
        const cosEl=Math.cos(this.elevation)
        const sinEl=Math.sin(this.elevation)
        // rotation Matrix around Z for Azimut
        const ZAz= [
            [cosSAz,-sinSAz,0,0],
            [sinSAz,cosSAz,0,0],
            [0,0,1,0],
            [0,0,0,1],
        ];
        // rotation Matrix around X for Elevation
        const X= [
            [1,0,0,0],
            [0,cosEl,-sinEl,0],
            [0,sinEl,cosEl,0],
            [0,0,0,1]]; 

        const ZAzT=transpose(ZAz)
        const XT=transpose(X)

        const rotationMAtrix = multiply( XT, ZAzT)
        return rotationMAtrix
    }

    formatZone=(model)=>{
        //console.log ('... Format Zone info')
        let zone = model.map(point=>([point.x, point.y]))
        return zone
    }
    
    findPeripheralZone= (model)=>{
        let pointsCluster = this.formatZone(model)
        const peripheralZone=convexHull(pointsCluster)
        return peripheralZone        
    }

    transformModel (){
        this.transformedPoints = this.refModel.map(point=>multiply(this.rotationMatrix, point)).map((point)=>({x:point[0][0], y:point[1][0], z:point[2][0]}))
    }




    
// __________________________________________________________________________________________________________

    getPoints () {
        console.log (`Display ${this.transformedPoints.length} Points`)
        return this.transformedPoints
    }

    getPeripheralPointIndexes (){
        if (this.transformedPoints.length ==0)
            return []
        const zone = this.findPeripheralZone(this.transformedPoints)
        const pointIndexes=  [... new Set(zone.join().split(','))]
        console.log (`... Detect ${pointIndexes.length} peripheral points (orange)`)
        return pointIndexes
        
    }

    setObjAzimuth (angle){
        console.log (`Set Object Azimuth`)
        this.objAzimuth = angle
        this.rotateModel ()
        this.transformModel()
    }

    setSunAzimuth (angle){
        console.log (`Set Sun Azimuth`)
        this.sunAzimuth = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }

    setElevation(angle){
        console.log (`Set Sun Elevation`)       
        this.elevation = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }
    getSegments = (model=this.transformedPoints)=>{
        let segments = this.initSegment.map((points)=>([model[points[0]],model[points[1]]]))  
        console.log (`Display ${segments.length} Segments`)
        return segments
    }

    getRefModel =(unit)=>{
        const max = Math.max(this.model.width, this.model.depth)
        const ratio = unit/max
        return this.refModel.map(point=>({x:point[0][0]*ratio,y:point[1][0]*ratio}))
    }

    getRefModelShape =(scale)=>{
        const refModel = this.getRefModel(scale)
        return this.getSegments (refModel)
        
    }
}
export default SolarPlaneCalculator;
