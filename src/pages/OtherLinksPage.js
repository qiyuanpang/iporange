import styled from 'styled-components';

const Styles = styled.div`
.center {
    margin: auto;
    width: 50%;
    padding: 10px;
}
`

function OtherLinksPage() {
    return (
        <Styles>
            <div className='center container'>
                <div>
                    <h5><a href='http://www.nasdaqtrader.com/Trader.aspx?id=MarketSystemStatus'>NASDAQTrader.com</a></h5>
                    <h5>Scroll down to: IPO Messages to see at what time your IPO will start trading.</h5>
                    <h5> </h5>
                </div>

                <div>
                    <h5><a href='https://www.retailroadshow.com/'>RetailRoadshow</a></h5>
                    <h5>RetailRoadshow provides electronic roadshows for individual investors seeking information about public offerings.</h5>
                    <h5> </h5>
                </div>

                <div>
                    <h5><a href='https://www.nasdaq.com/news-and-insights'>NASDAQ</a></h5>
                    <h5>RetailRoadshow provides electronic roadshows for individual investors seeking information about public offerings.</h5>
                    <h5> </h5>
                </div>

                <div>
                    <h5><a href='https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent'>SEC Filings</a></h5>
                    <h5>Latest Filings Received and Processed at the SEC.</h5>
                    <h5> </h5>
                </div>
            </div>
        </Styles>
    )
}

export default OtherLinksPage;