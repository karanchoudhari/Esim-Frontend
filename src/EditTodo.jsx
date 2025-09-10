import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { edittodo } from "./Redux/EditTodo";

const EditTodo = ({todo})=>{
    const [title,setTitle] = useState(todo ?todo.title : '');
    const [description,setDescription] = useState(todo ? todo.description : '')
    const dispatch = useDispatch();
    const {isLoading,isError} = useSelector((state)=>state.edittodo);


    const HandleSubmit = (e)=>{
        e.preventDefault();
        dispatch(edittodo({id:todo._id,title,description}))
        setTitle('');
        setDescription(''); 
    }
    return(
        <>
       
        {isError&& <span>Kuch Gadbad hai</span>}
        
        <form onSubmit={HandleSubmit}  method="post">
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} /> <br /><br />
            <input type="text" value={description} onChange={(e)=>{setDescription(e.target.value)}}  /> <br />

            <button>{isLoading ? 'updating..' : 'updated'}</button>
        </form>
        </>
    )
}

export default EditTodo;