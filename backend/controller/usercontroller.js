const users=require("../model/userModel");
const jwt=require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {parse}=require('csv-parse');
const fs=require('fs');
const { createCanvas} = require('canvas');
const {Chart,registerables} = require('chart.js');
Chart.register(...registerables);
// const read=async(path)=>{
//     // const path="tasks\\backend\\uploads\\file-1710967110294-carprices.csv";
// };
let result= []
exports.signUp=async(req,res,next)=>{
    req.body.password =await bcrypt.hash(req.body.password,13);
    const newUser=await users.create(
        {
            emailId:req.body.emailId,
            password:req.body.password,
            
        }
    );
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(201).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    });
};


exports.login=async(req,res,next)=>{
    const {emailId,password}=req.body;
    if(!emailId||!password){
        res.status(400).json({
            status:"fail"
        })
        res.send({status:400,message:"please provide email and password"});
    }
    const user = await users.findOne({ emailId });
    if (!user) {
        res.status(400).json({
          status:"fail",
          message:"invalid email"
        })
      }
    const correct =await user.correctPassword(password, user.password);
    if (!correct) {
    res.status(400).json({
      status:"fail",
      message:"invalid email or password"
    })
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(200).json({
        status:"success",
        token
    })
};



exports.upload = async (req, res, next) => {
     result = [];
    fs.createReadStream(req.file.path)
        .pipe(parse({ delimiter: ',', from_line: 1 }))
        .on('data', (data) => {
            result.push(data);
            console.log(data);
        })
        .on('error', function (error) {
            console.log(error.message);
        })
        .on('end', function () {
            console.log('File read successful');
            const labels=result[0];
            res.status(200).json({ status: 'success', labels});
        });
};

exports.generateChart = async (req, res, next) => {
    const selectedLabels = req.body.selectedLabels;
    console.log(selectedLabels);
    const labelIndices = selectedLabels.map(label => {
        return result[0].indexOf(label); 
    }); 
    console.log(labelIndices);
    const data = labelIndices.map(index => result.map(row => row[index]));

    console.log(data);
    //Replace null values with median of the column
    for (let i = 0; i < data.length; i++) {
        const column = data[i];
        const cleanedColumn = column.filter(value => value !== null && value !== '' && !isNaN(value));
        const median = calculateMedian(cleanedColumn);
        data[i] = column.map(value => (value === null || value === '' || isNaN(value)) ? median : value);
    }
    console.log(data);
    const labels = data[0];
    const values = data[1];

    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "chart",
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, chartConfig);
    const dataUrl = canvas.toDataURL();
    res.status(200).json({
        status: 'success',
        url: dataUrl
    });
};

// Function to calculate the median of an array
function calculateMedian(arr) {
    const sorted = arr.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
}


    

// --------------------------------------------------------------------------------
// exports.upload=async(req,res,next)=>{
//     const result=[];
//     fs.createReadStream(req.file.path).pipe(parse({delimiter:",",from_line:1}))
//     .on("data",(data) => {result.push(data);console.log(data);})
//     .on("error",function(error){
//         console.log(error.message);
//     })
//     .on("end",function(){
//         console.log("File read successful");
//         const labels = result.map(data => data[0]);
//         const values = result.map(data => data[data.length-2]);
//         console.log(labels,values);
//         const chartConfig = {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label:"chart",
//                     data: values,
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         };
//         const canvas = createCanvas(800, 600);
//         const ctx = canvas.getContext('2d');
//         const chart =new Chart(ctx,chartConfig);
//         const dataUrl = canvas.toDataURL();            
//         res.status(200).json({
//             status:"success",
//             // data:result,
//             url:dataUrl
//         })
//     });
// };


