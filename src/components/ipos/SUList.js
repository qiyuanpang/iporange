import Table2 from '../ui/Table2';
import {useEffect, useState} from 'react';


function SUList(props) {
    // const [items, setItems] = useState([{}]);
    let items = [{}];
    if (props.items) {
        items = props.items;
    }
    // console.log(props.item)
    return (
        <div>
            <h1 className='title' text-align='center' fontFamily='arial, sans-serif'>
                {props.title}
            </h1>
            <Table2 items={items} key={"sulist-"+props.SorU+Math.floor(Math.random() * 13254)} SorU={props.SorU} Auth={props.Auth}/>
        </div>
    );
}

export default SUList;