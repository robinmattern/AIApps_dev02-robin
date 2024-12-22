   import   fs                from 'fs/promises';  
   import   path              from 'path';
   import { fileURLToPath }   from 'url';
   import   dotenv            from 'dotenv';

   import { createAnthropic } from '@ai-sdk/anthropic';
   import { generateText }    from 'ai';

      var __dirname        =  path.dirname( fileURLToPath( import.meta.url ) ); global.path = path
       var  aAppDir        =  __dirname; global.aAppDir  = aAppDir

            dotenv.config(  { path: path.join( aAppDir, '.env' ) } )

       var  aTS            =  fmtTS()     

       var  aVer           =  process.env.Ver
       var  aRequest_file  =  process.env.SubChapsReq   // "S2b_Subchapters_Request_v1.06-{Date}.md"
//     var  aResponse_file =  process.env.Model4bResp   // "S4b_SubChapters-Result_v1.06-{Date}.{Time}.json"
       var  aResponse_file = "S4b_SubChapters-Result_v1.06-{Date}.{Time}.json"

       var  aRequest_file  =  aRequest_file.replace(  /{Date}/, aTS.slice( 0, 5 ) )  // should be set by getTranscript
       var  aResponse_file =  aResponse_file.replace( /{Date}.{Time}/, aTS ).replace( /{Ver}/, aVer )

       var  aRequest_path  =  path.join( aAppDir, aRequest_file ) 
       var  aResponse_path =  path.join( aAppDir, aResponse_file ) 
       
                              await summarizeVideo( aRequest_path, aResponse_path  )  
       
                              console.log(   `\nSummarized SubChapter Prompt file, '${ aRequest_file  }` );
                              console.log(   `          into JSON Response file: '${ aResponse_file }', successfully!` );

                              await updateEnvFile( 'Model4bResp', aResponse_file )
              
         // -----------------------------------------------------------------------------------

async function summarizeVideo( aRequest_path, aResponse_path ) { 

       var  pAI            =  createAnthropic( { apiKey: process.env.CLAUDE_API_KEY } );
       var  aModel         =  process.env.CLAUDE_MODEL 

       var  aRequest_json  =  
             { "model"     :  pAI( aModel )
             , "prompt"    :  await fs.readFile( aRequest_path, 'ASCII' )
                }
       try { 
       var  pResult        =  await generateText( aRequest_json );
       var  aResult_text   =  pResult.text.replace( /.+[`]{3}json\n/s, '' ).replace( /[`]{3}.*/s, '' )
        } catch (pError) { 
            console.log(  `\n* Model failed!\n  ${ pError }` )
            process.exit() 
           }
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

async function updateEnvFile( aParm, aValue ) {
   var  nKeyWidth   =  16 
   var  aEnvPath    =  path.join( aAppDir, './.env' )
   var  aEnvContent =  await fs.readFile( aEnvPath, 'utf8')
   var  aKey        =  aParm.padEnd( nKeyWidth ), aVal = aValue.trim()
    if (aEnvContent.includes( `${aKey}=` )) {  // If key exists, replace its value
        aEnvContent =  aEnvContent.replace( new RegExp( `${aKey}=.*` ), `${aKey}= '${aVal}'` )
    } else {
        aEnvContent += `\n${aKey}= '${aVal}'`  // If key doesn't exist, append it
        }
        await fs.writeFile( aEnvPath, aEnvContent)
     } // eof updateEnvFile
// ----------------------------------------------------------------


       
