'use strict'
//import {convexHull} from 'convex-hull'
//import {transpose, multiply} from 'matrix-lib-js'
const ch= require ('convex-hull')
const { transpose, multiply } = require ('matrix-lib-js')

class SolarPlaneCalculator {

    constructor (model, objAzimuth, sunAzimuth, elevation){
        this.model = model
        this.sunAzimuth = sunAzimuth
        this.objAzimuth = objAzimuth||0
        this.elevation = elevation
        this.initSegment =[]
        this.initModel =[]
        this.points =[]
        // parsing Model
        this.init()

        this.rotationMatrix=this.buildRotationMatrix()
        //console.log ('rotation Mat', this.rotationMatrix)
        this.transformedPoints=[]
        this.transformModel()
    }

    init(){
        //console.log (`Init Model`)
        this.initSegment=this.model.segments
        this.initModel=this.model.points

        this.translationVector=[
            this.model.x0||0,
            this.model.y0||0,
            this.model.z0||0 
        ]

        /* console.log (`Create a reference ${this.initModel.length} points Model to dimension W, D, P`, 
            this.model.width,
            this.model.depth, 
            this.model.height) */

            this.rotateModel() // =>this.refModel
    }

    rotateModel (){
        //console.log ('.. Adjust Object Position')
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
        // console.log ("initModel",this.initModel)
        this.refModel = this.initModel
                            .map(point=>({ 
                                            x:point.x, 
                                            y:-point.y, 
                                            z:point.z
                                        }))
                            .map(point=>([[point.x],[point.y],[point.z],[1]])) // refModel being an array of points vector 3x1
                            .map(point=>multiply(matrix,point))
    }
    
    buildRotationMatrix (){
        // console.log ('.. Adjust Solar Plane in function of sun azimuth and elevation')

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
        // console.log ("pointsCluster",pointsCluster)
        const peripheralZone=ch(pointsCluster)
        // console.log ("peripheralZone",peripheralZone)
        return peripheralZone        
    }

    transformModel (){
        this.transformedPoints = this.refModel.map(point=>multiply(this.rotationMatrix, point)).map((point,index)=>({x:point[0][0], y:point[1][0], z:point[2][0], label:this.initModel[index].label}))
    }
    
// __________________________________________________________________________________________________________

    getPoints () {

        // console.log (`Display ${this.transformedPoints.length} Points`)
        return this.transformedPoints
    }

    getPeripheralPointIndexes (){


        if (this.transformedPoints.length ==0){
                // console.log ('No transformed Points detected')
                return []
        }
        const zone = this.findPeripheralZone(this.transformedPoints)
        // console.log ("zone", zone)
        const pointIndexes=  [... new Set(zone.join().split(','))]
        // console.log (pointIndexes)
        // console.log (`... Detect ${pointIndexes.length} peripheral points (orange)`)
        return pointIndexes
    }

    setObjAzimuth (angle){
        // console.log (`Set Object Azimuth`)
        this.objAzimuth = angle
        this.rotateModel ()
        this.transformModel()
    }

    setSunAzimuth (angle){


        // console.log (`Set Sun Azimuth`)
        this.sunAzimuth = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }

    setElevation(angle){

        // console.log (`Set Sun Elevation`)       
        this.elevation = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }

    getSegments = (model=this.transformedPoints)=>{
        describe.todo('get Segments')

        let segments = this.initSegment.map((points)=>([model[points[0]],model[points[1]]]))  
        //  console.log (`Display ${segments.length} Segments`)
        return segments
    }

    getRefModelByUnit =(unit=1)=>{

        const max = Math.max(this.model.width, this.model.depth)
        const ratio = unit/max
        //console.log (max,this.model.width, this.model.depth,unit, ratio, this.refModel)
        return this.refModel.map(point=>({
                                            x:point[0][0]*ratio,
                                            y:point[1][0]*ratio,
                                            z:point[2][0]*ratio
                                        }))
    }

    getRefModelByRatio =(ratio=1)=>{

        return this.refModel.map(point=>({
                                            x:point[0][0]*ratio,
                                            y:point[1][0]*ratio,
                                            z:point[2][0]*ratio
                                        }))
    }

    getRefModelShapeByUnit =(scale)=>{

        const refModel = this.getRefModelByUnit(scale)
        return this.getSegments (refModel)
        
    }
}

module.exports = SolarPlaneCalculator