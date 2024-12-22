   import   fs                from 'fs/promises';  
   import   path              from 'path';
   import { fileURLToPath }   from 'url';
   import   dotenv            from 'dotenv';

// import { xai }             from '@ai-sdk/xai';
   import { createXai }       from '@ai-sdk/xai';
   import { generateText }    from 'ai';
// import   ai                from 'ai';

      var __dirname        =  path.dirname( fileURLToPath( import.meta.url ) ); global.path = path
       var  aAppDir        =  __dirname; global.aAppDir  = aAppDir

            dotenv.config(  { path: path.join( aAppDir, '.env' ) } )

       var  aTS            =  fmtTS()     

       var  aRequest_file  = "S2b_Subchapters_Request_v1.06-{Date}.md"
       var  aResponse_file = "S4b_SubChapters-Result_v1.06-{Date}.{Time}.json"

       var  aRequest_file  =  aRequest_file.replace(  /{Date}/, aTS.slice( 0, 5 ) )
       var  aResponse_file =  aResponse_file.replace( /{Date}.{Time}/, aTS )

       var  aRequest_path  =  path.join( aAppDir, aRequest_file ) 
       var  aResponse_path =  path.join( aAppDir, aResponse_file ) 
       
              summarizeVideo( aRequest_path, aResponse_path  )  
         
         // -----------------------------------------------------------------------------------

async function summarizeVideo( aRequest_path, aResponse_path ) { 

       var  pXAI           =  createXai( { apiKey: process.env.GROK_API_KEY } );

       var  aRequest_json  =  
             { "model"     :  pXAI( 'grok-2-1212' )
             , "prompt"    :  await fs.readFile( aRequest_path, 'ASCII' )
                }

       var  pResult        =  await generateText( aRequest_json );
       var  aResult_text   =  pResult.text.replace( /.+[`]{3}json\n/s, '' ).replace( /[`]{3}.*/s, '' )

                              await fs.writeFile( aResponse_path, aResult_text )
//     var  pResult_json   =  JSON.parse( aResult_text ) 

//          console.log( pResult_json )
            } // eof summarizeVideo
// -----------------------------------------------------------------------------------

  function  fmtTS( ) {
       var  aTS = (new Date).toLocaleString('en-US', {
              year: '2-digit', month:  '2-digit', day:    '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
             } ).replace(/[\/]/g, "-").replace(/[,]/g, ".").replace(/[-: ]/g, "")
    return `${aTS.slice(5,6)}${aTS.slice(0,4)}.${aTS.slice(7,11)}`
            } // eof fmtTS 
// ----------------------------------------------------------------


       
