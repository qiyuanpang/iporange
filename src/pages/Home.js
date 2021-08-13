import { useState, useEffect } from 'react';

import IpoList from '../components/ipos/IpoList';
import IpoListGainers from '../components/ipos/IpoListGainers';
import IpoListLosers from '../components/ipos/IpoListLosers';
import UpcomingIPOsList from '../components/ipos/UpcomingIPOsList';
import styled from 'styled-components';
import FooterPage from './Footer';
import PrefixPage from './Prefix';

const Styles = styled.div`

.center {
    position: relative;
    margin: auto;
    width: 60%;
    padding: 10px;
}
`

function ShowPeriod(days) {
    if (days === 7) {
        return '1 week'
    } else if (days === 14) {
        return '2 weeks'
    } else if (days === 30) {
        return '1 month'
    } else if (days === 60) {
        return '2 months'
    } else if (days === 90) {
        return '3 months'
    }
}

function WhichType(type, data) {
    if (type === 'Gainers') {
        return <IpoListGainers key="topgainers" ipos={data} prefix={''}/>
    } else if (type === 'Losers') {
        return <IpoListLosers key="toplosers" ipos={data} prefix={''}/>
    }
}

function HomePage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [loadedTopIPOs, setLoadedTopIPOs] = useState([{}]);
    const [period, setPeriod] = useState(30);
    const [type, setType] = useState('Gainers');
    const [num, setNum] = useState(10);

    useEffect(() => {
        // setIsLoading(true);
        // console.log(period, type)
        if (type === 'Gainers'){
            const url = '/api/topgainers/' + period.toString() + '/' + num.toString();
            fetch(url).then(response => {
                // console.log(typeof(response), response)
                return response.json();
            }).then(data => {
                let ipos = [];
                // console.log(typeof(data), data.length, data)
                for (const key in data) {
                    const ipo = {
                        id: key,
                        ...data[key]
                    };

                    ipos.push(ipo);
                }
                // console.log(ipos)
                setLoadedTopIPOs(ipos);
            });
        } else if (type === 'Losers') {
            const url = '/api/toplosers/' + period.toString() + '/' + num.toString();
            fetch(url).then(response => {
                // console.log(typeof(response), response)
                return response.json();
            }).then(data => {
                let ipos = [];
                // console.log(typeof(data), data.length, data)
                for (const key in data) {
                    const ipo = {
                        id: key,
                        ...data[key]
                    };

                    ipos.push(ipo);
                }
                // console.log(ipos)
                setLoadedTopIPOs(ipos);
            });
        }
        // setIsLoading(false);
    }, [type, period, num]);
    
    // if (isLoading) {
    //     return (
    //         <section>
    //             <p>Loading...</p>
    //         </section>
    //     )
    // }
    // console.log('what',typeof(loadedIpos), loadedIpos.length, loadedIpos[0])
    
    // console.log(loadedTopIPOs)
    
    return (
        <Styles>
            <div className="center" key="home-div-1">
                <h3 className='title' text-align='center' fontFamily='arial, sans-serif'>
                    {'Top '}
                    <select
                        value={num}
                        onChange={e => {
                        setNum(e.target.value)
                        }}
                    >
                        {[5, 10, 20, 50].map(num => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                        ))}
                    </select>
                    {' '}
                    <select
                        value={type}
                        onChange={e => {
                        setType(e.target.value)
                        }}
                    >
                        {['Gainers', 'Losers'].map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                        ))}
                    </select>
                    {' in '}
                    <select
                        value={period}
                        onChange={e => {
                        setPeriod(Number(e.target.value))
                        }}
                    >
                        {[7, 14, 30, 60, 90].map(period => (
                        <option key={period} value={period}>
                            {ShowPeriod(period)}
                        </option>
                        ))}
                    </select>
                </h3>
                {WhichType(type, loadedTopIPOs)}
            </div>
        </Styles>
    )
}

export default HomePage;
