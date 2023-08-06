// var bodyParser = require('body-parser');
// var mongoose = require('mongoose')
// var imgSchema = require('./model.js');
// var fs = require('fs');
// var path = require('path');
// app.set("view engine", "ejs");
// require('dotenv').config();

// mongoose.connect(process.env.MONGO_URL)
// .then(console.log("DB Connected"))

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// // var multer = require('multer');

// // var storage = multer.diskStorage({
// // 	destination: (req, file, cb) => {
// // 		cb(null, 'uploads')
// // 	},
// // 	filename: (req, file, cb) => {
// // 		cb(null, file.fieldname + '-' + Date.now())
// // 	}
// // });

// // var upload = multer({ storage: storage });

// // app.get('/', (req, res) => {
// // 	imgSchema.find({})
// // 	.then((data, err)=>{
// // 		if(err){
// // 			console.log(err);
// // 		}
// // 		res.render('imagepage',{items: data})
// // 	})
// // });


// app.post('/', upload.single('image'), (req, res, next) => {

// 	var obj = {
// 		name: req.body.name,
// 		desc: req.body.desc,
// 		img: {
// 			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
// 			contentType: 'image/png'
// 		}
// 	}
// 	imgSchema.create(obj)
// 	.then ((err, item) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		else {
// 			// item.save();
// 			res.redirect('/');
// 		}
// 	});
// });

// var port = process.env.PORT || '3000'
// app.listen(port, err => {
// 	if (err)
// 		throw err
// 	console.log('Server listening on port', port)
// })


// let array = [1, 2, 3, 4, 4, 5, 6, 8, 8];

// let result = array.reduce((acc, curr) =>  {acc += curr % 2 === 0 ? curr : 0}, 0);



// console.log(result)
let array2 = [9, 8, 7, 1, 2, 3, 4, 2, 8];
const sortArray = (array) => {
	let result = [];
	let size = array.length;
	for (let i = 0; i < size; i++) {

		let remove = array.reduce((acc, curr) => {return acc > curr ? acc : curr}, 0)

		result.unshift(remove);
		let index = array.indexOf(remove);
		array.splice(index, 1);

	}
	return result;
}

console.log(sortArray(array2));
// let test = []

// test.push(1)
// console.log(test)

// test.push(2)
// console.log(test)

// test.shift()
// console.log(test)