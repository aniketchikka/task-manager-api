require("../src/db/mongoose")

const { count } = require("../src/models/task");
const Task=require("../src/models/task")

// 6003e388da3f0307b4b06262
// Task.findByIdAndDelete('6003e388da3f0307b4b06262').then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then((count)=>{
//     console.log(count)
// }).catch((error)=>{
//     console.log(error);
// });

// 

const deleteTaskAndCount=async(id)=>{

    const task=await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false});
    return count;
}

deleteTaskAndCount('6003ef3171ae7d0a1865fb7b').then((count)=>{
console.log(count)
}).catch((e)=>{
    console.log(e);
})