import React, { useState } from "react";


const UpdatePopup:React.FC<{onUpdate:()=>void}> = ({onUpdate})=>{
    const [showPopup, setShowPopup] = useState(false)
    const [editFirstname,setEditFirstname] = useState("")
    const [editLastname, setEditLastName] = useState("")
    const [editUsername, setEditUsername] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editPicture, setEditPicture] = useState<File|undefined>()

    const togglePopup = () => {
        setShowPopup(!showPopup)
    }

    const handleUpdateProfile = async (e:React.FormEvent)=>{
        e.preventDefault()

        const formData = new FormData()
        if(editFirstname){
            formData.append("firstname",editFirstname)
        }
        if(editLastname){
            formData.append("lastname",editLastname)
        }
        if(editUsername){
            formData.append("username",editUsername)
        }
        if(editEmail){
            formData.append("email",editEmail)
        }
        if(editPicture){
            formData.append("profilePicture",editPicture)
        }

        try{
            const response = await fetch("http://localhost:5000/user/profile",{
                method:"PUT",
                headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`},
                body:formData
            })
            
            if(response.status == 200){
                localStorage.removeItem("userInfo")
                onUpdate()
            }
            
        }catch(err){
            console.log(err)
        }
    }

    return (
        <>
        <button className="btn btn-secondary col-2" onClick={togglePopup}>Edit</button>
        {showPopup && (<div className="modal" tabIndex={-1} style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }} onClick={togglePopup}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e)=>e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header justify-content-center">
                        <h5>Edit Profile</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e)=>{e.preventDefault(); handleUpdateProfile(e); togglePopup()}}>
                            <div>
                                <label className="form-label" htmlFor="editFirstname">First Name</label>
                                <input className="form-control" type="text" id="editFirstname" value={editFirstname} onChange={(e) => setEditFirstname(e.target.value)}/>
                            </div>
                            <div className="mt-3">
                                <label className="form-label" htmlFor="editLastname">Last Name</label>
                                <input className="form-control" type="text" id="editLastname" value={editLastname} onChange={(e) => setEditLastName(e.target.value)}/>
                            </div>
                            <div className="mt-3">
                                <label className="form-label" htmlFor="editUsername">Username</label>
                                <input className="form-control" type="text" id="editUsername" value={editUsername} onChange={(e) => setEditUsername(e.target.value)}/>
                            </div>
                            <div className="mt-3">
                                <label className="form-label" htmlFor="editEmail">Email</label>
                                <input className="form-control" type="text" id="editEmail" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}/>
                            </div>
                            <div className="mt-3">
                                <label className="form-label" htmlFor="edit Picture">Profile Picture</label>
                                <input className="form-control" type="file" id="editPicture" onChange={(e) => setEditPicture(e.target.files?.[0])}/>
                            </div>
                            <div className="d-flex justify-content-around align-content-center mt-4">
                                <button className="btn btn-primary col-5" type="submit">Save</button>
                                <button className="btn btn-danger col-5" type="reset" onClick={togglePopup}>Cancel</button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>)}
        </>
    )
}

export default UpdatePopup