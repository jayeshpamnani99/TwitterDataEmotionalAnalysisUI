import React from 'react';
import customAxios from '../helpers/customAxios';

import update from 'immutability-helper';

import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

class AutoComplete extends React.Component{
    constructor(props){
        super(props);

        this.state = {suggestions:[],loading:false,selectedHashtag:null}

        this.searchData = this.searchData.bind(this);
    }
    

    searchData(value){
        const newState = update(this.state,{
            loading:{$set:true}
        })

        this.setState(newState,()=>{
            customAxios.get('/hashtag/search',{params:{hashtag:value} })
        
            .then((response)=>{

                var suggestions = [];

                if(response && response.data){
                    suggestions = response.data;
                }

                const newState = update(this.state,{
                    suggestions:{$set:suggestions},
                    loading:{$set:false}
                })

                this.setState(newState);

            })
            .catch((err)=>{
                const newState = update(this.state,{
                    loading:{$set:false}
                })

                this.setState(newState);
            })

        
        })

        
        

        //e.preventDefault()
    }


    render(){

        if(this.state.selectedHashtag){
            const selectedHashtag = this.state.selectedHashtag;

            const newState = update(this.state,{
                selectedHashtag:{$set:null}
            });
            this.setState(newState);
            return <Redirect to={"/"+selectedHashtag}/>
            
            
        }

        return (
            <div>
                <Autocomplete 
                    freeSolo={true}
                    options={this.state.suggestions}
                    getOptionLabel={(option)=>{return option.hashtag}}
                    onInputChange={(e,value)=>{this.searchData(value)}}
                    onChange={(e,option)=>{

                        const newState = update(this.state,{
                            selectedHashtag:{$set:option.hashtag}
                        })
                        
                        this.setState(newState);

                    }}
                    renderInput = {(params)=>{
                        return <TextField {...params} label="Search for Hashtag" variant="outlined"/>
                    }}
                />
            </div>
        )
    }


}

export default AutoComplete;