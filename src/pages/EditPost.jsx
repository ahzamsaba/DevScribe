import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { data, useNavigate, useParams } from "react-router-dom";
import { databases } from "../services/appwriteConfig";
import { useAuth } from "../context/AuthContext";

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';

const DB_ID = '686129ee00359232eef7';
const COLLECTION_ID = '686129fc001b052b39e4';

export default function EditPost() {
    const {id} = useParams()
    const {user} = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await databases.getDocument(DB_ID, COLLECTION_ID, id)
                if(res.userId !== user.$id) {
                    alert("You are not authorized to edit this post!")
                    navigate('/')
                }
                else{
                    setTitle(res.title)
                    setContent(res.content)
                    setLoading(false)
                }
            } catch (err) {
                console.error("Error loading post: ",err);
                navigate('/')
            }
        }

        fetchPost();
    }, [id, navigate, user])

    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            await databases.updateDocument(DB_ID, COLLECTION_ID, id, {
                title,
                content,
            });
            navigate(`/post/${id}`)
        } catch (err) {
            console.error("Update failed: ",err);
            alert("Failed to update post!")
        }
    };

    if(loading) return <p className="text-center mt-10">Loading post...</p>

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleUpdate}>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border p-2 mb-4 rounded"
                />

                <Editor 
                    value={content}
                    onEditorChange={(newVal) => setContent(newVal)}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: 'link image lists code',
                        toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                        branding: false
                    }}
                />

                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800"
                >
                    Update Post
                </button>
            </form>
        </div>
    )
}