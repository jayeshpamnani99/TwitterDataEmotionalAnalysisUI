import React from 'react';


import HashtagsList from '../components/HashtagsList';
import Hashtag from '../components/Hashtag';


import {BrowserRouter as Router, Switch , Route , Link} from 'react-router-dom';
import AutoComplete from '../components/AutoComplete';


import HomeIcon from '@material-ui/icons/Home';

class Home extends React.Component{

    constructor(props){
        super(props);

    }

    render(){
        return(
            <div style={{padding:"1%"}}>

                <Router>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridAutoRows:"1fr"}}>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <Link to="/">
                                <HomeIcon />
                            </Link>
                            
                        </div>
                        <div style={{width:"100%"}}>
                            <AutoComplete />
                        </div>
                        <div></div>
                    </div>
                    <Switch>
                            <Route exact path="/:hashtag" component={Hashtag} ></Route>
                            <Route path="/" component={HashtagsList}></Route>

                    </Switch>

                </Router>
            </div>
        );
    }

}

export default Home;