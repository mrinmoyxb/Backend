import React from "react";

export default function Input(props){
    let { placeholder, name, onChange } = props;
    return (
        <div>
            <input name={name} placeholder={placeholder} className="input-field" onChange={onChange}/>
        </div>
    )
}