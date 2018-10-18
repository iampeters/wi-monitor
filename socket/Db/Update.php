<?php
// header('Content-Type: application/json');

class Update {
    private $msg;
    protected $dbConn;
    
    function setMsg($msg) { $this->msg = $msg;}
    function getMsg() { return $this->$msg;}

    public function __construct() {
        
        require_once('Database.php');
        $db = new Database;
        $this->dbConn = $db->connect();
    }

    public function saveMessage() {
        $result = $this->dbConn->prepare('INSERT INTO `messages` (`id`, `text`) VALUES(null, :msg)');
        $result->bindParam(':msg', $this->msg);

        if ( $result->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function getChat() {

        $std = array();
        # Sql
        $sql = "select text from messages";

        $result = $this->dbConn->prepare($sql);
        $std;
        
        // $rows = $result->setFetchMode(PDO::FETCH_ASSOC); 
        try {
            if ($result->execute()) {
                while ($chat = $result->fetch(PDO::FETCH_ASSOC)) {
                    $this->std[] = $chat;
                }
            }
        } catch (Exception $e) {
            echo $e->getChat();
        }
        return $this->std;
    }

}

// $ab = new Update();
// $ab->getChat();

?>