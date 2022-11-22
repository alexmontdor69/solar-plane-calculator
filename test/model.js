const model={
        name:"house",
        points:
        [
            {x:0, y:0, z:0, label:'1'},
            {x:0, y:0, z:1, label:'2'},
            {x:1, y:0, z:0, label:'3'},
            {x:1, y:0, z:1, label:'4'},
            {x:.5, y:0.33, z:1.5, label:'5'},
            {x:1, y:1, z:0, label:'6'},
            {x:1, y:1, z:1, label:'7'},
            {x:0, y:1, z:0, label:'8'},
            {x:0, y:1, z:1, label:'9'},
            {x:.5, y:0.66, z:1.5, label:'10'},
        ],
        segments:
        [
            [0,1],[0,2],[0,7],[3,4],[1,3],[1,8],
            [2,3],[3,6],[8,9],[1,4],[6,9],[6,8],
            [6,9],[5,7],[5,6],[2,5],[7,8], [4,9]
        ],
        twoDModel: false,
        width:1,
        depth:1,
        height:1,
        x0:0,
        y0:0,
        symetrical:true
    
}
module.exports=  {model}