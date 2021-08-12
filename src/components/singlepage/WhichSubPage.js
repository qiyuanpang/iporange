import Overview from "./Overview";
import Comments from "./Comments";
import HistoricalQuotes from "./HistoricalQuotes";
import News from "./News";
import Profile from "./Profile";

function WhichSubPage(props) {
    if (props.subpage === "overview") {
        return <Overview  key={props.symbol +"-s-" + props.subpage} symbol={props.symbol} Auth={props.Auth} priced={props.priced}/>
    } else if (props.subpage === "comments") {
        return <Comments  key={props.symbol +"-s-" + props.subpage} symbol={props.symbol} Auth={props.Auth} priced={props.priced}/>
    } else if (props.subpage === "historicalquotes") {
        return <HistoricalQuotes  key={props.symbol +"-s-" + props.subpage} symbol={props.symbol} Auth={props.Auth} priced={props.priced}/>
    } else if (props.subpage === "news") {
        return <News  key={props.symbol +"-s-" + props.subpage} symbol={props.symbol} Auth={props.Auth} priced={props.priced}/>
    } else if (props.subpage === "profile") {
        return <Profile  key={props.symbol +"-s-" + props.subpage} symbol={props.symbol} Auth={props.Auth} priced={props.priced}/>
    }
}

export default WhichSubPage;