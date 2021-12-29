
import React, { useState } from 'react';

import update from 'immutability-helper';
import customAxios from '../helpers/customAxios';

import {LineChart , Line , XAxis , YAxis, Tooltip, Legend} from 'recharts';
import {RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

import {TwitterTweetEmbed} from 'react-twitter-embed';

import moment from 'moment';
import { Card, Chip } from '@material-ui/core';
import CustomTwitterEmbed from './CustomTwitterEmbed';

function CountCard(props){

    return(
        <div>
            <Card style={{padding:"10%"}}>
                <h5>{props.card.title}</h5>
                <h3>{props.card.count}</h3>
            </Card>

        </div>
    )
}


function EmbedTweet(props){

    return (
        <div>
            <TwitterTweetEmbed tweetId={props.id} options={{conversation:"none",cards:"hidden"}}/>
            
        </div>
    );
}

function HashtagRadarChart(props){

    const tones = ["Joy","Confident","Analytical","Tentative","Sadness","Fear","Anger"];

    const sentiments = [];

    tones.map((tone,index)=>{
        sentiments[index] = Object.assign({},{"sentiment":tone,score:props.sentiments[tone+"Percentage"]});
    })

    return(
        <div>
            <RadarChart width={730} height={250} data={sentiments}>
                <PolarGrid />
                <PolarAngleAxis dataKey="sentiment" />
                <PolarRadiusAxis />
                <Radar name="Sentiments" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Legend />
            </RadarChart>
        </div>
    )
}

function HashTagScoreLineChart(props){

    const [ selected , updateSelected ] = useState(0);
    
    const sentiments = {"Joy":{color:"green"},"Confident":{color:"orange"},"Analytical":{color:"blue"},"Tentative":{color:"brown"},"Sadness":{color:"grey"},"Fear":{color:"pink"},"Anger":{color:"red"}};
    
    
    const timelines = {"All":"dataMin","Past Hour":moment().subtract(1,"hours").valueOf(),"Past 24 hours":moment().subtract(24,"hours").valueOf(),"Past 7 days":moment().subtract(7,"days").valueOf(),"Past 30 days":moment().subtract(30,"days").valueOf(),"Past 90 days":moment().subtract(90,"days").valueOf(),"Past 12 months":moment().subtract("12","months").valueOf()};

    return(
        <div>
            <div>
                {
                    Object.keys(timelines).map((timeline,index)=>{
                        return <Chip label={timeline} color={(index === selected)?"primary":""} clickable={true} onClick={()=>{updateSelected(index)}}/>
                    })
                }
            </div>

            <LineChart  width={700} height={300} data={props.history}>
                
                

                {
                    Object.keys(sentiments).map((sentiment)=>{
                        return <Line type="monotone" dataKey={sentiment+"Percentage"} stroke={sentiments[sentiment].color} dot={false}/>
                    })
                }
                
                <XAxis dataKey="timestamp" label={{value:"Time",position:"bottom",offset:"-5"}} type="number" domain={[timelines[Object.keys(timelines)[selected]],"dataMax"]}  allowDataOverflow={true} tickFormatter={(tick)=>{return moment(tick).calendar(null,{sameElse:"DD/MM/YYYY"})}}/>
                <YAxis label={{value:"Score",position:"left",angle:-90,offset:"-5"}}/>
                <Tooltip labelFormatter={(tick)=>{return moment(tick).format("Do MMMM, YYYY")}} />
                <Legend />
            </LineChart>
        </div>
        
    );
}


function HashTagCountLineChart(props){

    return(
        <div>
            <LineChart  width={700} height={300} data={props.history}>

                
                <Line type="monotone" dataKey={"count"} dot={false}/>
                
                <XAxis dataKey="timestamp" label={{value:"Time",position:"bottom",offset:"-5"}} tickFormatter={(tick)=>{return moment(tick).calendar(null,{sameElse:"DD/MM/YYYY"})}}/>
                <YAxis label={{value:"Count",position:"left",angle:-90,offset:"-5"}}/>
                <Tooltip labelFormatter={(tick)=>{return moment(tick).format("Do MMMM, YYYY")}}/>
            </LineChart>
        </div>
        
    );
}


class Hashtag extends React.Component{
    constructor(props){
        super(props);

        this.state = {hashtag : {} , loading:true}

        this.loadHashtag = this.loadHashtag.bind(this);

        
    }
    

    componentDidMount(){

        

        this.loadHashtag(this.props);
    }

    

    componentWillReceiveProps(newProps){
        this.loadHashtag(newProps); 
    }
    
    loadHashtag(props){

        const newState = update(this.state,{
            loading:{$set:true}
        });

        
        const hashtagFromUrl = props.match.params.hashtag;

        this.setState(newState,()=>{
            customAxios.get('/hashtag',{params:{hashtag:hashtagFromUrl}})
                .then((response)=>{

                    var hashtag = {};

                    if(response && response.data){
                        hashtag = response.data;
                    }
                    
                    //console.log(hashtag);

                    const newState = update(this.state,{
                        loading:{$set:false},
                        hashtag:{$set:hashtag}
                    });        
                    this.setState(newState);
                })
                .catch((err)=>{
                    const newState = update(this.state,{
                        loading:{$set:false}
                    });
                    this.setState(newState);
                })
        })


    }

    render(){
        return(
            <div style={{width:"100%",height:"100%"}}>


                <div style={{width:"100%",heigth:"100%"}}>
                {
                    (this.state.hashtag && this.state.hashtag.tones && this.state.hashtag.tones.length > 0)?
                        <div>
                            <h3>#{this.state.hashtag.hashtag}</h3>
                            
                            <div style={{display:"flex",justifyContent:"center",padding:"1%"}}>
                                <HashTagScoreLineChart history={this.state.hashtag.tones}/>
                            </div>
                            
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",padding:"1%"}}>
                                <CountCard card={{title:"Total Tweets",count:this.state.hashtag.count}}/>

                                {
                                    ["Joy","Confident","Analytical","Tentative","Sadness","Fear","Anger"].map((tone)=>{
                                        return (
                                            this.state.hashtag.tones[this.state.hashtag.tones.length-1][tone+"Count"] > 0 && <CountCard card={{title:tone+" Count",count:this.state.hashtag.tones[this.state.hashtag.tones.length-1][tone+"Count"]}}/>
                                        )
                                        
                                    })
                                }

                                
                            </div>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",padding:"1%"}}>
                                <div>
                                    <Card style={{disaply:"flex",justifyContent:"center"}}>
                                        <h4 style={{textAlign:"center"}}>Hashtag Percentage</h4>
                                        <HashtagRadarChart sentiments={this.state.hashtag.tones[this.state.hashtag.tones.length-1]}/>
                                    </Card>
                                </div>
                                
                            </div>
                            <div style={{display:"flex",justifyContent:"center",padding:"1%"}}>
                                <HashTagCountLineChart history={this.state.hashtag.tones}/>
                            </div>
                            {/* <div style={{display:"flex",flexDirection:"row",overflowX:"scroll",padding:"1%"}}>
                                {
                                    this.state.hashtag.tweets.map((tweet)=>{
                                        return <CustomTwitterEmbed tweetId={tweet} options={{conversation:"none",cards:"hidden"}}/>
                                    }) 
                                }
                            </div> */}
                            
                        </div>
                    :(this.state.loading)?null:null  
                }
                </div>
            </div>
        )
    }
}

export default Hashtag;