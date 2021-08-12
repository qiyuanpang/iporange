import {useEffect, useState} from 'react';
import PrefixPage from '../../pages/Prefix';

function NewsList(props) {
    return props.map(item => {
        const {headline, href, timeline} = item;
        return (
            <li className="list-group-item" key={props.symbol+"-news-list-item"+Math.floor(Math.random() * 57842).toString()}>
                <h3 className="title">
                    <a href={href} className="link" style={{color: '#17202A'}}>{headline}</a>
                </h3>
                <div>
                    <span><small className="text-muted" style={{color: '#6a6a6a'}}>{timeline}</small></span>
                </div>
            </li>
        )
    })
}

function News(props) {
    const [news, setNews] = useState([{}])
    const Symbol = props.symbol
    useEffect(() => {
        const url = '/api/news/' + Symbol;
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            setNews(data.news)
        })
    }, [])
    return (
        <div className="container" key={props.symbol+"-news-body"}>
            <ul className="list-group" key={props.symbol+"-news-list"}>
                {NewsList(news)}
            </ul>
        </div>
    )
}

export default News;