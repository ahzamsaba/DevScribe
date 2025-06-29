import { useState } from "react";
import {Editor} from '@tinymce/tinymce-react'
import {useAuth} from '../context/AuthContext'
import { databases } from "../services/appwriteConfig";
import { ID, Permission, Role } from "appwrite";
import {useNavigate} from 'react-router-dom'

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.min.css'; // ✅ required
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';



const DB_ID = '686129ee00359232eef7'
const COLLECTION_ID = '686129fc001b052b39e4' //posts

export default function CreatePost() {
  const {user} = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      const response = await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          title,
          content,
          userId: user.$id,
          createdAt: new Date().toISOString()
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id))
        ]
      );

      console.log("Post created: ", response);
      navigate('/')
    } catch (err) {
      console.error('Error creating post: ',err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 mb-4 rounded"
        />

        <Editor
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
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
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
}