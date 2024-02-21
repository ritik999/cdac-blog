import { createSlice } from "@reduxjs/toolkit";

const initialState={
    theam:'light',
}

const theamSlice=createSlice({
    name:'theam',
    initialState,
    reducers:{
        toggleTheam:(state)=>{
            state.theam=state.theam==='light'?'dark':'light';
        }
    }
})

export const {toggleTheam}=theamSlice.actions;
export default theamSlice.reducer