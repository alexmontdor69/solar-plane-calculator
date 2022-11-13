# Display a 3D object in a Solar Plane

## SolarPlaneCalculator Class

This SolarPlaneCalculator class calculates the orthogonal plane to the direction of the sun beams.

The new coordinates are computed with a rotatton matrix. The polar position of the sun defines this rotation matrix.

The coordinates are given by a model

### Model Input

__the models format__

<code>
{

    value: {

        name:"House",

        points:

        [

            {x:0, y:0, z:0, label:'1'},
            {x:1 y:1, z:1, label:'2'},

        ],

        segments:

        [

            [0,1]

        ],

        width:14,

        depth:9,

        height:5,

        x0:number,

        y0:number,

        z0:number


    }

}

</code>

where :

- value : code of the model
- name : name of the model
- points : array of the points defining the shape of the model. the point are defined by {x:number, y:number, z:numer, label:name},
- segments : array of the pair of point indexes defining a segment
- width : number defining the width of the model
- depth : number defining the depth of the model
- height : number defining the height of the model
- x0,y0,z0 are number defining the coordinates of the symetrical axis 


__the Class methods__

- getPoints :  Get the coordinates of the model point in the new Plane
- getSegments : Get all the pair of point indexes describing the object
- getPeripheralPointIndexes :  Get the indexes of the point in peripheral of the object shape in the new plane
- setObjAzimuth : Set the azimuth angle (radian) of the object
- setSunAzimuth : Set the azimuth angle (radian) of the sun
- setElevation : Set the elevation angle (radian) of the sun
- getRefModelShape : Get a scaled X-Y plane shape
