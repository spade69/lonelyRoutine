var webpack=require('webpack');
var path=require('path');
var commonsPlugin=new webpack.optimize.CommonsChunkPlugin({
    filename:"common.js",
    name:"commons"
})
module.exports={
    entry:{
        index:'./app/entry.js'
    },
    output:{
        path:path.join(__dirname,"dist"),
        filename:"[name].bundle.js",
        chunkFilename:"[id].chunk.js"
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:'style!css',
            },
            {
                test:/\.jsx?$/,
                loader:'babel-loader'  //loader babel 
            }
        ]
    },
    plugins:[commonsPlugin]
} 