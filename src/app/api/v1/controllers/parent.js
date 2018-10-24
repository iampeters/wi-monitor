const parentModel = require('../models/parent')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

module.exports = (app) => {

  var SESSION;

  // parent login
  app.post('/parent/login', jsonParser, (req, res) => {
    SESSION = req.sesssion

    const { username, ward } = req.body;

    if ( username == '' || ward == '') {
      res.status(401).send('Unauthorized Access /');
      res.end();
    }
    else {
      // check if ward exist and return the id
      parentModel.ward(ward, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (!rows) {
            res.status(401).json({success: false, message: 'Invalid login credentials'})
            res.end();
          }
          else {
            // store the ward id
            var user_id = rows.user_id

            // Checking if this guardian is associated with the ward
            parentModel.login(username, user_id, (err, rows, fields) => {
              if (err) {
                console.log(`Error: ${err}`);
              }
              else {
                if (!rows) {
                  res.status(401).json({success: false, message: 'Invalid login credentials'})
                  res.end();
                }
                else {
                    // store the ward id
                    var guardian_id = rows.id;

                    var data = {
                      success : true,
                      parent : username,
                      ward : ward,
                      ward_id : user_id
                    }

                    // ADD TO SESSION VARIABLES
                    SESSION.wid = user_id
                    SESSION.parent = username
                    SESSION.parent_id = guardian_id

                    // RETURN RESPONSE
                    res.json(data)
                    res.end()
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
        res.json({success: true})
    }
    else {
        res.json({success: false})
    }
  })


  // parent chats
  app.post('/parent/chat', jsonParser, (req, res) => {
    SESSION = req.session
    const { message } = req.body

    if (message !== '') {
      // saving session Variables
      var key = SESSION.game,
          pid = SESSION.parent_id,
          parent = SESSION.parent;

      // get ward_id
      parentModel.getWardId(parent, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (!rows) {
            res.status(404).json({success: false, message: 'No records found'})
            res.end();
          }
          else {
            // store result
            var ward_id = rows[0].ward_id

            // get wards username
            parentModel.getWardUsername(ward_id, (err, rows, fields) => {
              if (err) {
                console.log(`Error: ${err}`);
              }
              else {
                if (!rows) {
                  res.status(404).json({success: false, message: 'No records found'})
                  res.end();
                }
                else {
                  // store result
                  var ward = rows[0].username;
                }
              }
            })
          }
        }
      })

      // insert into chat tbl
      parentModel.chatInsert(parent, ward, key, message, (err, res) => {
          if (err) {
            console.log(`Error: ${err}`);
          }
          else {
            if (!res) {
              res.status(501).json({success: false, message: 'Failed to insert chat'})
              res.end();
            }
            else {
              // store result
              res.status(200).json({success: true, message: 'Inserted'})
              res.end();
            }
          }
      })
    }
    else {
      res.json({success: false, message: 'Please Enter a message'})
      res.end();
    }
  })

  // parents logout
  app.get('/parent/logout', (req, res) => {
    SESSION = req.session

    if (SESSION.parent) {
      req.session.destroy( (err) => {
        if (err) {
          res.json({success: false})
        }
        else {
          res.json({success: true})
        }
      })
    }
  })

}
