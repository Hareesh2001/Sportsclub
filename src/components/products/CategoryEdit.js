import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Backend_url from '../../Config'
const CategoryEdit = ({ c, setCategoriesTrigger, categoryTrigger,setShowEditCategory,productTrigger,setProductTrigger }) => {
    const [name, setName] = useState('')
    const [oldName,setOldName] = useState('')
    useEffect(() => {
        if (c) {
            setName(c.name)
            setOldName(c.name)
        }
    }, [c])
    const deleteHandle = (id) => {
       if(window.confirm("Do you want to delete the Category")){
        axios.delete(`${Backend_url}/category/${id}`).then(res => {
            console.log("deleted")
            setShowEditCategory(false);
            setProductTrigger(!productTrigger)
            setCategoriesTrigger(!categoryTrigger)
        }).catch(err=>{
            window.alert(err)
        })
       }
    }
    const EditHandle = (id) =>{
        axios.put(`${Backend_url}/category/${oldName}`,{
            "id":id,
            "name":name
        }).then(res => {
            setShowEditCategory(false);
            setProductTrigger(!productTrigger)
            setCategoriesTrigger(!categoryTrigger)
        }).catch(err=>{
            window.alert(err)
        })
    }
    return (
        <div>

            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "50%", padding: "5px", marginBottom: "5px" }} />
            <i class="fa-solid fa-pen-to-square" style={{ background: "", color: "blue", cursor: "pointer", marginLeft: "5px" }} onClick={e=>EditHandle(c.id)}></i>
            <i class="fa-solid fa-xmark" style={{ background: "", color: "red", cursor: "pointer", marginLeft: "15px" }} onClick={e => { deleteHandle(c.id) }}></i>
        </div>
    )
}

export default CategoryEdit