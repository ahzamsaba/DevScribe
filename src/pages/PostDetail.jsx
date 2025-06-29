import { useParams, useNavigate, data } from "react-router-dom";
import { useEffect, useState } from "react";
import { databases } from "../services/appwriteConfig";
import { useAuth } from "../context/AuthContext";

const DB_ID = '686129ee00359232eef7'
const COLLECTION_ID = '686129fc001b052b39e4'//posts

export default function PostDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {user} = useAuth()

    const [post, setPost] = useState(null)

    useEffect(() => {
        const getPost = async() => {
            try {
                const res = await databases.getDocument(DB_ID, COLLECTION_ID, id)
                setPost(res)
            } catch (err) {
                console.error('Post not found: ',err);
                navigate('/')
            }
        };

        getPost()
    }, [id, navigate])

    if(!post) return <p className="text-center mt-10">Loading...</p>

    const handleSubmit = async () => {
        const confirm = window.confirm("Are you sure you want to delete this post?")
        if(!confirm) return;

        try {
            await databases.deleteDocument(DB_ID, COLLECTION_ID, post.$id)
            navigate('/')
        } catch (err) {
            console.error("Delete failed: ",err);
            alert("Failed to delete post")
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 text-sm mb-6">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{__html: post.content}}
            />

            {user?.$id === post.userId && (
                <div className="mt-6 flex gap-4">
                    <button 
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 active:bg-yellow-700"
                        onClick={() => navigate(`/edit/${post.$id}`)}
                    >
                        Edit
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 active:bg-red-800"
                        onClick={handleSubmit}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}