<?php
// session_start();
// header('Access-Control-Allow-Origin: *');


/**
 * 
 */
class Algorithm {

	private $dbConn;
	private $username;
	private $logged_in_user_id;
	private $subject_id;
	private $rand;
	private $subject;
	
	function __construct()
	{
		# Database Connection
        require_once('Database.php');
        $db = new Database();
        $this->dbConn = $db->connect();
	}

	public function tagger() {
		$std = array();
        # Sql
        $sql = "SELECT subject from Subjects limit 1";

        $result = $this->dbConn->prepare($sql);
        $std;
        
        // $rows = $result->setFetchMode(PDO::FETCH_ASSOC); 
        try {
            if ($result->execute()) {
                 $chat = $result->fetch(PDO::FETCH_ASSOC); //{
                //     $this->std[] = $chat;
                // }
                $this->std = $chat;
            }
        } catch (Exception $e) {
            return $e->getChat();
        }
        
        return $this->std;
	}
}

?>