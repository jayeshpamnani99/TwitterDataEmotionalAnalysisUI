import React from 'react';


class CustomTwitterEmbed extends React.Component{
    constructor(props){
        super(props);
    }


    
    componentWillReceiveProps(props){
        this.refs.twitterContainer.innerHTML = ""
        if(window.twttr){
            window.twttr.widgets.createTweet(
                props.tweetId,
                this.refs.twitterContainer,
                props.options
            )
        }
        
    }

    
    componentDidMount(){
        
        
        if(window.twttr){
            window.twttr.ready(function (twttr){
                window.twttr.widgets.createTweet(
                    this.props.tweetId,
                    this.refs.twitterContainer,
                    this.props.options
                )
            })
            
        }
    
    }
        
        
    render(){

        return(
            <div>
                <div ref="twitterContainer"></div>
            </div>

        );
    }
}

export default CustomTwitterEmbed;