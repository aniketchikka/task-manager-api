require('../src/db/mongoose')

const User=require('../src/models/user')

// 60040af015433c2c040e389f

//with mongoose library it take cares of the $set attribute
// User.findByIdAndUpdate('60040b44218ac32614423509',{ age:1 }).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// });

const updateAgeAndCount=async(id,age)=>{
        const user=await User.findByIdAndUpdate(id,{age:age})
        const count=await User.countDocuments({age})
        return count;
    
    }
    
    updateAgeAndCount('60040af015433c2c040e389f',2).then((count)=>{
        console.log(count);
    }).catch((e)=>{
        console.log(e);
    })