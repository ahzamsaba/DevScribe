import { useParams, useNavigate, data } from "react-router-dom";
import { useEffect, useState } from "react";
import { databases } from "../services/appwriteConfig";
import { useAuth } from "../context/AuthContext";
import { ID, Permission, Role } from "appwrite";
import { Query } from "appwrite";

const DB_ID = '686129ee00359232eef7'
const COLLECTION_ID = '686129fc001b052b39e4'//posts
const COMMENTS_COLLECTION_ID = '686383810039072c777d'

export default function PostDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {user} = useAuth()

    const [post, setPost] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState([])

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
        fetchComments();
    }, [id, navigate])

    // Load comments
    const fetchComments = async () => {
        try {
            const res = await databases.listDocuments(
                DB_ID,
                COMMENTS_COLLECTION_ID,
                [
                    Query.equal("postId", id),
                    Query.orderDesc("createdAt")
                ]
            )
            const sorted = res.documents.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )

            setComments(sorted)
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    }

    // Submit commet
    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if(!commentText.trim()) return

        try {
            await databases.createDocument(
                DB_ID,
                COMMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    postId: id,
                    userId: user.$id,
                    userName: user.name || user.email,
                    content: commentText,
                    createdAt: new Date().toISOString()
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            );

            setCommentText("")
            fetchComments()
        } catch (err) {
            console.error("Failed to submit comments", err);
        }
    }

    const handleEditComment = async (comment) => {
        const newContent = prompt("Edit your comment:",comment.content)
        if(!newContent) return

        try {
            await databases.updateDocument(DB_ID, COMMENTS_COLLECTION_ID, comment.$id, {
                content: newContent
            })

            fetchComments()
        } catch (error) {
            console.error("Failed to update comment", error);
        }
    } 

    const handleDeleteComment = async(commentId) => {
        const confirm = window.confirm("Delete this comment?")
        if(!confirm) return

        try {
            await databases.deleteDocument(DB_ID, COMMENTS_COLLECTION_ID, commentId)
            fetchComments()
        } catch (err) {
            console.error("Failed to delete comment", err)
        }
    }

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

            {/* Comment form */}
            {user && (
                <form onSubmit={handleSubmitComment} className="mt-8">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full border p-2 rounded mb-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800"
                    >
                        Post Comment
                    </button>
                </form>
            )}

            {/* Commet list */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                {comments.length === 0 && (
                    <p className="text-gray-500">No comments yet.</p>
                )}
                {comments.map((comment) => (
                    <div key={comment.$id} className="bg-gray-100 p-3 rounded mb-3">
                        <p className="font-semibold">{comment.userName}</p>
                        <p className="text-sm text-gray-600 mb-1">
                            {new Date(comment.createdAt).toLocaleString()}
                        </p>
                        <p>{comment.content}</p>

                        {user?.$id === comment.userId && (
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleEditComment(comment)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment.$id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}