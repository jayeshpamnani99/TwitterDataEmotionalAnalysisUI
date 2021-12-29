import React from 'react';

import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip';

import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import FaceIcon from '@material-ui/icons/Face';
import MoodBadIcon from '@material-ui/icons/MoodBad';

import customAxios from '../helpers/customAxios';

import update from 'immutability-helper';
import { Link } from 'react-router-dom';


import InfiniteScroll from 'react-infinite-scroll-component';

function HashtagListItem(props){

    const sentiments = {"Joy":{icon:<SentimentVerySatisfiedIcon/>,color:"green"},"Confident":{icon:<SentimentVerySatisfiedIcon/>,color:"orange"},"Analytical":{icon:<SentimentSatisfiedIcon/>,color:"blue"},"Tentative":{icon:<FaceIcon/>,color:"brown"},"Sadness":{icon:<SentimentVeryDissatisfiedIcon/>,color:"grey"},"Fear":{icon:<MoodBadIcon/>,color:"pink"},"Anger":{icon:<SentimentVeryDissatisfiedIcon/>,color:"red"}};


    return(
        <div>

            <Card style={{padding:"1%",height:"100%"}}>
                <Link to={props.hashtag.hashtag}>
                    <h3>#{props.hashtag.hashtag}</h3>

                    <h5>Total Tweets : {props.hashtag.count}</h5>

                    <div>
                        {
                            props.hashtag && props.hashtag.tones && Object.keys(sentiments).map((tone)=>{
                                return (
                                props.hashtag.tones[tone+"Count"] > 0 && <Chip icon={sentiments[tone].icon} label={tone + ":" + props.hashtag.tones[tone+"Count"]} color="primary" style={{backgroundColor:sentiments[tone].color,color:"white"}} />
                                )
                            })
                        }
                    </div>
                </Link>
            </Card>
        </div>
    )
}

class HashtagsList extends React.Component{

    constructor(props){
        super(props);
 

        this.state = {hashtags:[],loading:true,pageno:0,limit:12,hasMore:true}


        this.loadHashtags = this.loadHashtags.bind(this);

    }

    

    componentDidMount(){


        this.loadHashtags();   
    }

    loadHashtags(){
        const newState = update(this.state,{
            loading:{$set:true}
        });
        
        this.setState(newState,()=>{
            customAxios.get('/hashtag/hashtags',{params:{pageno:this.state.pageno}})
            .then((response)=>{

                var hashtags = [];
                
                var hasMore = true;


                if(response && response.data){
                    hashtags = response.data;
                
                    if(hashtags.length < this.state.limit){
                        hasMore = false;
                    }
                }

                

                const newState = update(this.state,{
                    loading:{$set:false},
                    hashtags:{$push:hashtags},
                    hasMore:{$set:{hasMore}}
                });

                this.setState(newState);
            })
            .catch((err)=>{
                const newState = update(this.state,{
                    loading:{$set:false},
                    hasMore:{$set:true}
                });

                this.setState(newState);
            })

        })
    }

    render(){
        return(
            <div>
                {
                    (this.state.hashtags && this.state.hashtags.length > 0)?
                        <div>
                            <div ref="hashtagslist" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridAutoRows:"1fr",gridGap:"10px"}}>    
                                {
                                    this.state.hashtags.map((hashtag)=>{
                                        return <HashtagListItem hashtag={hashtag}/>
                                    })
                                }
                            </div>
                            
                            <InfiniteScroll
                                dataLength={this.state.hashtags.length}
                                next={()=>{
                                    const newState = update(this.state,{
                                        pageno:{$set:this.state.pageno+1}
                                    })
                                    
                                    this.setState(newState,()=>{
                                        this.loadHashtags()
                                    });
                                }}
                                hasMore={this.state.hasMore}
                                loader={<div style={{disaply:"flex",justifyContent:"center",textAlign:"center",padding:"25px"}}>Loading Content</div>}
                                endMessage={<div style={{disaply:"flex",justifyContent:"center",textAlign:"center",padding:"25px"}}>You have reached the end</div>}
                                scrollableTarget={this.refs.hashtagslist}
                            />
                        </div>
                        
                        
                    :(this.state.loading)?null:null  
                }
                
            </div>
        );
    }
}

export default HashtagsList;