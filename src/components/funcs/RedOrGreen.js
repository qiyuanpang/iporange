import { Badge } from "react-bootstrap";

function redorgreen(num) {
    if (num > 0) {
        return (
            // <span className="badge badge-pill badge-light" style={{color: '#21CA07'}}>{`(${(num*100).toFixed(2)}%)`}</span>
            <Badge bg='light' text='success' pill>{`${(num*100).toFixed(2)}%`}</Badge>
        )
    } else if (num < 0) {
        return (
            // <span className="badge badge-pill badge-light" style={{color: '#EB2D16'}}>{`(${(num*100).toFixed(2)}%)`}</span>
            <Badge bg='light' text='danger' pill >{`${(num*100).toFixed(2)}%`}</Badge>
        )
    } else {
        return (
            // <span className="badge badge-pill badge-light" style={{color: '#808B96'}}>{`(${(num*100).toFixed(2)}%)`}</span>
            <Badge bg='light' text='secondary' pill>{`${(num*100).toFixed(2)}%`}</Badge>
        )
    } 
}

export default redorgreen;