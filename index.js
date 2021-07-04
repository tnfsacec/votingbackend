const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
//const cors = require('cors')

const port = 8888

/*const corsConfig = {
	origin: 'localhost:3000/',
	optionSuccessStatus: 200
}*/

//app.use(cors(corsConfig))

const mysqlconfig = {
	//mysql configuration
	host: 'localhost',
	user: 'tnfsacec',
	password: 'YoudontknowandIdontknoweither',
	database: 'tnfsavoting',
	port: 3306,
	ssl: false
}
const conn = new mysql.createConnection(mysqlconfig)
conn.connect((err) => {
	if (err) throw err;
	console.log("connection success!!")
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
	res.send("Hello World")
})

app.get('/home/:page',(req,res)=>{
	res.set('Access-Control-Allow-Origin','*')
	res.set('Access-Control-Allow-Headers','Content-Type')
	res.set('Content-Type','application/json')
	const pageid = parseInt(req.params.page,10)
	if(pageid < 1){
		return res.status('404')
	}
	count = "select count(*) as cnt from post"
	conn.query(count,(err,postcount)=>{
		var begin = postcount[0].cnt-5*pageid+1//req.params.pageid*5-4
		var end = postcount[0].cnt-5*pageid+5//(req.params.pageid*5)
		temp = "select * from post where id between "+begin+" AND "+end+";"
		var jsonReturn = []
		var count = 0
		conn.query(temp,(err,results)=>{
			for(var place = 4;place >= 0;--place){
				if(results[place] === undefined){
					continue;
				}else{
					params = {title: results[place].title,subtitle: results[place].subtitle,time: results[place].time,id: results[place].id}
					jsonReturn.push(params)
				}
			}
			jsonReturn.count = count
			return res.json(JSON.parse(JSON.stringify(jsonReturn)))
			//return res.json({"name": "Dorothea"})
		})
	})
})

app.get('/post/:id',(req,res)=>{
	postid = parseInt(req.params.id,10)
	temp = 'select * from post where id = '+postid+';'
	res.set('Access-Control-Allow-Origin','*')
	res.set('Access-Control-Allow-Headers','Content-Type')
	res.set('Content-Type','application/json')

	conn.query(temp,(error,result)=>{
		if(result.length === 0){
			return res.json(null)
		}
		params = {title: result[0].title,context: result[0].context}

		return res.json(JSON.parse(JSON.stringify(params)))
	})
})

app.listen(port,()=>{
	console.log("server running on port "+ port)
})
