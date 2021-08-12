import classes from './IpoItem.module.css';
import Card from '../ui/Card';

function IpoItem(props) {
    return (
        <li className={classes.item}>
            <Card>
                <div className={classes.content}>
                    <h2>{props.company}</h2>
                    <p>{props.symbol}</p>
                    <p>{props.offeringprice}</p>
                    <p>{props.startingprice}</p>
                    <p>{props.effectivedate}</p>
                </div>
            </Card>
        </li>
    );
}

export default IpoItem;