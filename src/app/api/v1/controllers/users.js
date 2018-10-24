const userModel = require('../models/users')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

module.exports = (app) => {

    var SESSION;

    // user login
    app.post('/login', jsonParser, (req, res) => {
        // SET THE SESSION
        SESSION = req.session;

        const { username, password } = req.body;
        if (username != '' && password != '') {
          // call the user model login function
          userModel.login(username, password, (err, rows, fields) => {
              if(err) {
                  console.log('A fatal error occurred');
              } else {
                  var user = rows[0];
                  if(!rows) {
                      res.json({success: false, message: 'Incorrect Login credentials'})
                      res.end();

                  } else {
                      // setting session variables
                      SESSION.username = user.username
                      SESSION.fullname = user.fullname
                      SESSION.uid = user.user_id
                      // return response
                      res.json({success: true, username: user.username, fullname: user.fullname})
                      // console.log(SESSION.username)
                  }
              }
          })
        } else {
          res.json({success: false, message: 'Username/Password required'})
        }
    })

    // Check if user is already logged in
    app.get('/is-logged-in', (req, res) => {

        if(req.session.username) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
    })

    // user registration
    app.post('/register', jsonParser, (req, res) => {
        // SET THE SESSION
        SESSION = req.session;
        const { username, fullname, password } = req.body;
        if ( username !== '' && fullname !== '' ) {

            // call the user model login function
            userModel.register(username, fullname, password, (err, res) => {
                if( err ) {
                    console.log('A fatal error occurred');
                } else {

                    if(!res) {
                        res.json({success: false, message: 'Username already taken'})
                        res.end();

                    } else {
                        res.json({success: true, message: 'Account registered successfully. Click on Login button'})
                    }
                }
            })

        } else {
            res.json({success: false, message: 'All fields are required'})
        }
    })

    //logout
	app.get('/logout', (req, res) => {

			req.session.destroy((err) => {
				if(err) {
					console.log('Error:' + err)
          res.json({success: false})
				}
        else {
					res.json({success: true})
				}
      })
    })


}
