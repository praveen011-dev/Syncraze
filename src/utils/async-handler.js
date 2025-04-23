function asyncHandler(requesthandler){
   
}


export {asyncHandler}


function asyncHandler(requesthandler){
    return function(req,res,next){
        Promise.resolve(requesthandler(req,res,next))
        .catch(function(err){
            next(err)
        })
    }
}

// return function(req,res,next){
//     Promise.resolve(requesthandler(req,res,next))
//     .catch(function(err){
//         next(err)
//     })
// }


// asyncHandler(async function handler(req, res, next) {
//     const data = await getData(); // could fail
//     res.send(data);
//   })
