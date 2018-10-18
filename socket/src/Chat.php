<?php
    namespace App;
    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;
    require('../Db/Query.php');

    class Chat implements MessageComponentInterface {
        protected $clients;

        public function __construct() {
            $this->clients = new \SplObjectStorage;
            echo 'Server connected...';
        }

        public function onOpen(ConnectionInterface $conn) {
            // Store the new connection to send messages to later
            $this->clients->attach($conn);

            echo "New connection! ({$conn->resourceId})\n";
        }

        public function onMessage(ConnectionInterface $from, $msg) {
            $numRecv = count($this->clients) - 1;
            echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
                , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
            
            $input = json_decode($msg, true);
            # Update class from Update.php
            switch ($input['name']) {
                case 'update':
                    require_once('../Db/Update.php');
                    $insert = new \Update();
                    $insert->setMsg($input['message']);
                    $insert->saveMessage();
                    $message = '{"message":"Sent"}';
                    $data = json_decode($message);
                    break;
                
                case 'chat':
                    require_once('../Db/Update.php');
                    $insert = new \Update();
                    $row = $insert->getChat();
                    // $data['text'] = $row['text'];
                    $data = $row;

                    break;
                
                case 'tagger':
                    require_once('../Db/Algorithm.php');
                    // $data = require_once('../../src/app/api/get/taga.php');
                    $list = new \Algorithm();
                    $data = $list->tagger();

                    

                    break;
                default:
                    $data = '{
                        "message" : "Oops! Something went wrong."
                    }';

            }

            foreach ($this->clients as $client) {
                if ($from == $client) {
                    // The sender is not the receiver, send to each client connected
                    $client->send(json_encode($data));
                }
            }
        }

        public function onClose(ConnectionInterface $conn) {
            // The connection is closed, remove it, as we can no longer send it messages
            $this->clients->detach($conn);

            echo "Connection {$conn->resourceId} has disconnected\n";
        }

        public function onError(ConnectionInterface $conn, \Exception $e) {
            echo "An error has occurred: {$e->getMessage()}\n";

            $conn->close();
        }
    }
?>