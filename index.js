// call package
var express = require('express')
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var configDB = require('./config/database.js');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// connect database

mongoose.connect(configDB.url, function(err) {
    if (err) throw err;
    console.info('Connected to database');
});



// call model
var Kid = require('./app/models/kids');
var Parent = require('./app/models/parents');
var Task = require('./app/models/tasks');
var Time = require('./app/models/times');

// ROUTE
var router = express.Router();
app.use('/api', router);



//-------------Route with KID

router.route('/kids/:kid_id')

	//--kid detail
	.get(function(req, res){
		Kid.findById(req.params.kid_id, function(err, kid){
			if (err) throw err;

			res.json(kid);
		});
	})


router.route('/kids/tasks/:kid_id')

	//--all tasks of a kid
	.get(function(req, res){
		Task.find({ kid_id : req.params.kid_id}, function(err, tasks){
			if (err) throw err;

			res.json(tasks);
		});
	})

router.route('/kids/tasks/item/:task_id')

	//--get a task
	.get(function(req, res) {
		Task.findById(req.params.task_id, function(err, task) {
			if (err) throw err;

			res.json(task);
		});
	})


	//--register or unregister a task
	.put(function(req, res) {
		Task.findById(req.params.task_id, function(err, task) {
			if (err) throw err;

			if (task.registed == true) {
				task.registed = false;
				task.save(function(err){
					if (err) throw err;
					res.json({ message : "Unregisted successful!"});
				});

			}
			else{
				task.registed = true;
				task.save(function(err){
					if (err) throw err;
					res.json({ message : "Registed successful!"});
				});
			}
		});
	})

router.route('/kids/tasks/registed/:kid_id')

	//--get all registed tasks of a kid
	.get(function(req, res) {
		Task.find({ kid_id : req.params.kid_id, registed : true }, function(err, tasks){
			if(err) throw err;

			res.json(tasks);
		});
	})

  // Route with time
router.route('/kids/times/:kid_id')
    // get all time for kid
    .get(function(req, res) {
      Time.find({ kid_id : req.params.kid_id}, function(err, times){
        if(err) throw err;
        var totaltime = 0;
         times.forEach(function (time){
           totaltime += time.time;
         });
         times.remove();
         res.json({time : totaltime});
      });
    })





//--------------Route with PARENT
router.route('/parents')
	//-- create parent
	.post(function(req, res) {
		// if (Parent.length() == 0) {
		// 	var parent = new Parent({
		// 			email : req.body.email,
		// 			name : req.body.name
		// 		});

		// 		parent.save(function(err) {
		// 			if (err) {throw err;}
		// 			res.json({ message : "Parent created!"});
		// 		});
		// }
		// else{
			Parent.findOne({ email : req.body.email} , function(err, parent){
				if (err) throw err;
				if (parent) {
					res.json({ message : "Email has been used!"});
				}
				else {
					var parent = new Parent({
						email : req.body.email,
						name : req.body.name
				});

				parent.save(function(err) {
						if (err) {throw err;}
						res.json({ message : "Parent created!"});
					});
				}
			});
		// }
	})


	//--get all the parents
	.get(function(req, res){
		Parent.find(function(err, parents){
			if (err) throw err;
			res.json(parents);
		});
	})



router.route('/parents/login')
	//--check login
	.post(function(req,res){
		Parent.findOne({email : req.body.email}, function(err, parent) {
			if (err) throw err;
			if (parent) {
				res.json(parent);
			}
			else {
				res.json({message : "Login fail!"})
			}
		})
	})


router.route('/parents/profile/:parent_id')
	//--get parent profile
	.get(function(req, res) {
		Parent.findById(req.params.parent_id , function(err, parent) {
			if (err) throw err;

			res.json(parent);
		});
	})

router.route('/parents/kids/:parent_id')
	//--create a kid
	.post(function(req, res) {
		var kid = new Kid({
			name : req.body.name,
			parent_id : req.params.parent_id
		});

		kid.save(function(err) {
			if (err) throw err;

			res.json({ message : "Kid created!"});
		});
	})


	// get all the kids of a parent
	.get(function(req, res) {
		Kid.find({ parent_id : req.params.parent_id}, function(err, kids) {
			if (err) throw err;
			res.json(kids);
		})
	})


router.route('/parents/kids/:parent_id/:kid_id')
	//--get a kid detail
	.get(function(req, res) {
		Kid.findOne({ parent_id : req.params.parent_id, _id : req.params.kid_id}, function(err, kid) {
			if (err) throw err;
			res.json(kid);
		});
	})

	//--change a kid detail
	.put(function(req, res){
		Kid.findOne({ parent_id : req.params.parent_id, _id : req.params.kid_id}, function(err, kid) {
			if (err) throw err;

			kid.name = req.body.name;
			kid.save(function(err) {
				if (err) throw err;
				res.json(kid);
			});

		});
	})

	//--delete a kid
	.delete(function(req, res) {
		Kid.remove({ parent_id : req.params.parent_id, _id : req.params.kid_id}, function(err, kid){
			if (err) throw err;

			res.json({ message : "Deleted kid successful!"});
		});
	})


router.route('/parents/tasks/:parent_id/:kid_id')
	//--create a task
	.post(function(req, res){
		var task = new Task({
			kid_id : req.params.kid_id,
			parent_id : req.params.parent_id,
			description : req.body.description,
			time : req.body.time,
			registed : false
		});

		task.save(function(err) {
			if (err) throw err;
			res.json({ message : "Task created!"});
		});
	})

	//-- get all the tasks for a kid
	.get(function(req, res){
		Task.find({ kid_id : req.params.kid_id , parent_id : req.params.parent_id}, function(err, tasks) {
			if (err) throw err;
			res.json(tasks);
		});
	})

router.route('/parents/tasks/delete/:task_id')
	//delete a task
	.delete(function(req, res) {
		Task.remove({ _id : req.params.task_id}, function(err, task){
			if (err) throw err;

			res.json({ message : "Deleted task successful!"});
		});
	})

router.route('/parents/tasks/approve/:task_id')
	//--approve a registed task
	.put(function(req, res) {
		Task.findById(req.params.task_id, function(err, task){
			if (err) throw err;
			if (task.registed == false) {
				res.json({message : "Task have not been registed!"});

			}
			else{
				var approve = task;
				task.remove();
				var taskTime = new Time({
          time : approve.time,
          kid_id : approve.kid_id
        });
        taskTime.save(function(err) {
          if (err) throw (err);
          res.json({ message: "Time added to db"});
        });
			}
		});
	})




//--------------Route with TASK






app.get('/', function (req, res) {
  res.send('Welcome to Kidup')
})

app.get('/api', function (req, res) {
  res.send('Welcome to API Kidup')
})

//---------------   PORT

app.listen(process.env.PORT || 8080, function(){
  console.log('App listening on port 8080!', this.address().port, app.settings.env);
});

app.listen(8080, function () {
  console.log('App listening on port 8080!')
});
