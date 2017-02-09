var webpack=require('webpack');
var path=require('path'),
    node_modules=path.resolve(__dirname,'node_modules');
//var pathToReact=path.resolve(node_modules,'react/dist/react.min.js');
var commonsPlugin=new webpack.optimize.CommonsChunkPlugin({
    filename:"common.js",
    name:"commons"
});

module.exports={
    entry:{
        index:'./src/entry.js'
    }/*,
    resolve:{
        alias:{
            'react':pathToReact
        }
    }*/,
    output:{
        path:path.join(__dirname,"dist"),
        filename:"[name].bundle.js",
        chunkFilename:"[id].chunk.js"
    },

    devtool:'inline-source-map',
    devServer:{
        //hot:true,
        contentBase:path.resolve(__dirname,'dist'),
        inline:true
    },

    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:'style-loader!css-loader',
            },
            {
                test:/\.scss$/,
                use:[{loader:"style-loader"}, //create style node from js strings 
                {loader:"css-loader"}, //translate css into Commonjs
                {loader:"sass-loader"} //compile Sass to css
                ]
            },
            {
                test:/\.jsx?$/,
                loader:'babel-loader',  //loader babel ,
                query:{
                    presets:['react','env']
                }
            }
        ],
        
    },
    plugins:[commonsPlugin]
} 