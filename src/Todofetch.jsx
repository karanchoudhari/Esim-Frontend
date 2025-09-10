import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateTodo } from "./Redux/createTodo";
import { fetchtodo } from "./Redux/Todo";
// import { edittodo } from "./Redux/EditTodo";


const Todofetch = ()=>{
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const {isLoading,isError,} = useSelector((state)=>state.createTodo)
    const payload = {title,description};
    const dispatch = useDispatch();
        const HandleSubmit =(e)=>{
            e.preventDefault();
            if (!payload) {
                alert('fill this')
            }
            dispatch(CreateTodo(payload));
            setTitle('');
            setDescription('');
            dispatch(fetchtodo())
        }

    return(
        <>

  
        {isError&& <span>Kuch Gadbad hai</span>}
        
        <form onSubmit={HandleSubmit}  method="post">
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} /> <br /><br />
            <input type="text" value={description} onChange={(e)=>{setDescription(e.target.value)}}  /> <br />

            <button>{isLoading ? 'loading..' : 'create'}</button>
        </form>
        
        </>
    )
}

export default Todofetch;