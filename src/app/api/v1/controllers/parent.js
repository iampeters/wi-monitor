const parentModel = require('../models/parent')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

module.exports = (app) => {

  var SESSION;

  // parent login
  app.post('/parent/login', jsonParser, (req, response) => {
    SESSION = req.sesssion

    const {
      username,
      ward
    } = req.body;

    if (username == '' || ward == '') {
      response.status(401).send('Unauthorized Access /');
      response.end();
    } else {
      // check if ward exist and return the id
      parentModel.ward(ward, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          if (rows == 0) {
            response.status(401).json({
              success: false,
              message: 'Invalid ward username'
            })
            response.end();
          } else {
            // store the ward id
            user_id = rows[0].user_id


            // Checking if this guardian is associated with the ward
            parentModel.login(username, user_id, (err, rows, fields) => {
              if (err) {
                console.log(`Error: ${err}`);
              } else {
                if (rows == 0) {
                  response.status(401).json({
                    success: false,
                    message: 'Invalid login credentials'
                  })
                  response.end();
                } else {
                  // store the ward id
                  var guardian_id = rows[0].id;

                  var data = {
                    success: true,
                    parent: username,
                    ward: ward,
                    ward_id: user_id
                  }

                  // ADD TO SESSION VARIABLES
                  req.session.wid = user_id
                  req.session.parent = username
                  req.session.parent_id = guardian_id
                  // console.log(`here is the user id ${user_id}`)

                  // RETURN RESPONSE
                  response.json(data)
                  response.end()
                }
              }
            })
          }
        }
      })
    }

  })

  // check if parent is loggedin
  app.get('/parent/is-logged-in', (req, res) => {
    SESSION = req.session

    if (SESSION.parent) {
      res.json({
        success: true
      })
    } else {
      res.json({
        success: false
      })
    }
  })


  // parent chats
  app.post('/parent/chat', jsonParser, (req, response) => {
    SESSION = req.session
    const {
      message
    } = req.body

    if (message !== '') {
      // saving session Variables
      var key = SESSION.game,
        pid = SESSION.parent_id,
        parent = SESSION.parent;

      // get ward_id
      parentModel.getWardId(parent, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          if (rows == 0) {
            response.status(404).json({
              success: false,
              message: 'No records found'
            })
            res.end();
          } else {
            // store result
            var ward_id = rows[0].ward_id

            // get wards username
            parentModel.getWardUsername(ward_id, (err, rows, fields) => {
              if (err) {
                console.log(`Error: ${err}`);
              } else {
                if (rows == 0) {
                  response.status(404).json({
                    success: false,
                    message: 'No records found'
                  })
                  res.end();
                } else {
                  // store result
                  var ward = rows[0].username;
                }

                // insert into chat tbl
                parentModel.chatInsert(parent, ward, key, message, (err, res) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  } else {
                    if (res == 0) {
                      response.status(501).json({
                        success: false,
                        message: 'Failed to insert chat'
                      })
                      response.end();
                    } else {
                      // store result
                      response.status(200).json({
                        success: true,
                        message: 'Inserted'
                      })
                      response.end();
                    }
                  }
                })
              }
            })
          }
        }
      })
    } else {
      response.json({
        success: false,
        message: 'Please Enter a message'
      })
      response.end();
    }
  })

  // parents logout
  app.get('/parent/logout', (req, res) => {
    SESSION = req.session

    if (SESSION.parent) {
      req.session.destroy((err) => {
        if (err) {
          res.json({
            success: false
          })
        } else {
          res.json({
            success: true
          })
        }
      })
    }
  })

}
