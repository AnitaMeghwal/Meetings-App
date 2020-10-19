const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Meeting model
const Meeting = require('../models/Meeting');

//Login Page
router.get('/login', (req,res) => res.render('login'));

//Login Page
router.get('/register', (req,res) => res.render('register'));

//Dashboard Page
router.get('/dashboard', (req,res) => res.render('dashboard'));

//Register Handle
router.post('/register', (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	// Check required feilds
	if(!name || !email || !password || !password2) {
		errors.push({ msg: 'Please fill in all the fields'});
	}

	// Check passwords match
	if(password !== password2) {
		errors.push({msg: 'Passwords do not match'});
	}

	// Check pass length
	if(password.length < 6) {
		errors.push({ msg: 'Password should be atleast 6 characters'});
	}

	if(errors.length > 0) {
		res.render('register',{
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		//res.send('pass');
		//Validation passed
		User.findOne({ email: email })
		.then(user => {
			if(user) {
				//User exists
				errors.push({ msg: 'Email is already registered'});
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					name,
					email,
					password
				});

				// Hash Password
				bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) throw err;
					// Set password to hashed
					newUser.password = hash;
					// Save user
					newUser.save()
					.then(user => {
						req.flash('success_msg', 'You are now registered and can log in');
						res.redirect('/users/login');
					})
					.catch(err => console.log(err));

				}))
			}
		});
	}		

});

//Meeting Handle
router.post('/dashboard', (req, res) => {
	const { title, organizer, participants, date, mtime } = req.body;
	let errors = [];

	// Check required feilds
	if(!title || !organizer || !participants || !date || !mtime) {
		errors.push({ msg: 'Please fill in all the fields'});
	}

	if(errors.length > 0) {
		res.render('dashboard', {
					errors,
					title,
					organizer,
					participants,
					date,
					mtime
				});
	} else {
		//res.send('pass');
		// Validation passed
		const newMeeting = new Meeting({
			title,
			organizer,
			participants,
			date,
			mtime
		});

		newMeeting.save()
					.then(user => {
						req.flash('success_msg', 'New meeting added');
						res.redirect('/users/dashboard');
					})
	}		
});

//Name Search Handle
router.post('/results', (req, res) => {
	const { searchName } = req.body;
	Meeting.find({ title:searchName }).then(meet =>{
		//res.json(meet);
		res.render('dashboard', {mdata:meet} );
		console.log(meet);
	})

});

//Organizer Search Handle
router.post('/resultsorg', (req, res) => {
	const { searchOrg } = req.body;
	Meeting.find({ organizer:searchOrg }).then(meet =>{
		//res.json(meet);
		res.render('dashboard', {mdata:meet} );
		console.log(meet);
	})
});

//Date Search Handle
router.post('/resultsdate', (req, res) => {
	const { searchDate } = req.body;
	Meeting.find({ date:searchDate }).then(meet =>{
		//res.json(meet);
		res.render('dashboard', {mdata:meet} );
		console.log(meet);
	})
});

//Time Search Handle
router.post('/resultstime', (req, res) => {
	const { searchTime } = req.body;
	Meeting.find({ mtime:searchTime }).then(meet =>{
		//res.json(meet);
		res.render('dashboard', {mdata:meet} );
		console.log(meet);
	})
});

//All Search Handle
router.post('/resultsall', (req, res) => {
	Meeting.find({ }).then(meet =>{
		//res.json(meet);
		res.render('dashboard', {mdata:meet} );
		console.log(meet);
	})
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;