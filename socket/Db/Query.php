<?php
    
// header('Content-Type: application/json');
class Query {
    private $query;
    private $std;

    public function __construct() {
        # Database Connection
        require_once('Database.php');
        $db = new Database();
        $this->query = $db->connect();
    }

    public function getChat() {
        # Sql
        $sql = "select * from messages";

        $result = $this->query->prepare($sql);
        $result->execute();
        $rows = $result->setFetchMode(PDO::FETCH_ASSOC); 
        if($result->execute()) {

            while($row = $result->fetchAll()) {
                $this->std = $row;
            }
            
            echo json_encode($this->std);
            
        } else {
            echo '{
                "error" : "something went wrong"
            }';
        }
    }
}
?>