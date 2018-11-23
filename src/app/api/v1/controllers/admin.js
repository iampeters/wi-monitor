const adminModel = require('../models/admin')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

module.exports = (app) => {
    var SESSION;

    // admin login
    app.post('/control', jsonParser, (req, res) => {
      // SET THE SESSION
      SESSION = req.session;
      const { email, password } = req.body;

      if (email != '' && password != '') {
        // call the user model login function
        adminModel.login(email, password, (err, rows, fields) => {
            if(err) {
                console.log('A fatal error occurred');
            } else {
                if(rows == 0) {
                    res.json({success: false})
                    res.end()
                }
                else {
                    var admin = rows[0];
                    // setting session variables
                    SESSION.admin = admin.username
                    // return response
                    res.json({success: true})
                }
            }
        })
      } else {
        res.json({success: false, message: 'Username/Password required'})
      }
    })

    // admin login verification
    app.get('/adminChk', (req, res) => {
      SESSION = req.session;

      if (SESSION && SESSION.admin) {
        res.json({success: true})
      }
      else {
        res.json({success: false})
      }
    })

    // admin logout
    app.get('/admin/logout', (req, res) => {
      if (req.session.admin) {
        req.session.destroy((err) => {
          if (err) {
            console.log('Error: ${err}');
            res.json({success: false})
          }
          else {
            res.json({success: true})
          }
        })
      }
    })

    // get wards
    app.get('/wards', (req, res) => {

      adminModel.wards((err, rows, fields) => {
        if (err) {
          console.log('Error: ${err}');
        }
        else {
          if (rows == 0) {
            res.json({success: false, message: 'No ward to display'})
          }
          else {
            // return an array of Wards
            res.json(rows);
            res.end();
          }
        }
      })

    })


    // get guardian
    app.post('/add/guardian', jsonParser, (req, response) => {
      const { guardian, ward, relationship, phone, email, username } = req.body;

      // Checking if the username is available
      adminModel.chkGuardian( username, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (rows != 0) {
            response.json({success: false, message: 'Sorry! Username already taken'})
            response.end()
          }
          else {
            // Inserting new guardian if username is available
            adminModel.addGuardian(guardian, ward, relationship, phone, email, username, (err, res) => {
              if (err) {
                console.log(`Error: ${err}`);
              }
              else {
                if (res == 0) {
                  response.json({success : false, message : "Oops! Could not insert guardian at this time"})
                  response.end();
                }
                else {
                  response.json({success : false, message : "Guardian inserted successfully"})
                  response.end();
                }
              }
            })

          }
        }

      })

    })

    // add subjects
    app.post('/add/subjects', jsonParser, (req, response) => {
      const {subject} = req.body;

      if(subject == '') {
        response.json({success: false, message: 'Select a subject to add'})
        response.end()
      }
      else {
        adminModel.addSubject(subject, (err, res) => {
          if (err) {
            console.log('Error: ${err}');
          }
          else {
            if (res == 0) {
              response.json({success: false, message: 'Sorry! Subject already exist in the server'})
            } else {
              response.json({success: true, message: 'Subject added successfully'})
            }
          }
        })
      }
    })

    // add question
    app.post('/add/questions', jsonParser, (req, response) => {
      const {question, subject, option1, option2, option3, answer} = req.body;

        adminModel.addQuestion( question, subject, answer, (err, res) => {
          if (err) {
            console.log(`Error: ${err}`);
          }
          else {
            if (res == 0) {
              response.json({success: false, message: 'Sorry! Subject already exist in the server'})
            } else {
              // get back the question id
              adminModel.query1(question, (err, rows, fields) => {
                if (err) {
                  console.log(`Error: ${err}`);
                }
                else {
                  if (rows == 0) {
                    response.json({success: false, message: 'Error! Could not get question id from server'})
                    response.end();
                  }
                  else {
                    // store results
                    var question_id = rows[0].question_id

                    // insert into to the answer table
                    adminModel.query2( question_id, subject, option1, option2, option3, answer, (err, res) => {
                      if (err) {
                        console.log(`Error: ${err}`);
                      }
                      else {
                        if (rows == 0) {
                          response.json({success: false, message: 'Error! Question could not be added at this time'})
                          response.end();
                        }
                        else {
                          response.json({success: true, message: 'Question successfully added'})
                          response.end();
                        }
                      }
                    })

                  }
                }
              })

              response.json({success: true, message: 'Subject added successfully'})
            }
          }
        })
    })

}
