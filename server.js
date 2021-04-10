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
	res.header('Content-Type','application/json')
	const pageid = parseInt(req.params.page,10)
	if(pageid < 1){
		return res.status('404')
	}
	count = "select count(*) as cnt from post"
	conn.query(count,(err,postcount)=>{
		var begin = postcount[0].cnt-5*pageid+1//req.params.pageid*5-4
		var end = postcount[0].cnt-5*pageid+5//(req.params.pageid*5)
		temp = "select * from post where id between "+begin+" AND "+end+";"
		var jsonReturn = {}
		var count = 0
		conn.query(temp,(err,results)=>{
			for(var place = 4;place >= 0;--place){
				if(results[place] === undefined){
					continue;
				}else{
					count++
					params = {priority:count+1,title: results[place].title,subtitle: results[place].subtitle,time: results[place].time,id: results[place].id}
					jsonReturn[count] = params
				}
			}
			jsonReturn.count = count
			return res.json(jsonReturn)
		})
	})
})

app.listen(port,()=>{
	console.log("server running on port "+ port)
})
