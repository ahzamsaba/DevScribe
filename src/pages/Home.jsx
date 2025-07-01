import { use, useEffect, useMemo, useState } from "react";
import {databases} from '../services/appwriteConfig'
import {Link} from 'react-router-dom'
import {debounce} from 'lodash'

const DB_ID = '686129ee00359232eef7'
const COLLECTION_ID = '686129fc001b052b39e4'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await databases.listDocuments(DB_ID,COLLECTION_ID)
        const sorted = res.documents.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        )
        setPosts(sorted)
        setFilteredPosts(sorted)
      } catch (err) {
        console.error("Error fetching posts:",err);
      }
    };

    fetchPosts()
  }, []);

  const debouncedFilter = useMemo(() => debounce((query) => {
    const lowered = query.toLowerCase()
    const results = posts.filter(
      (post) => 
        post.title.toLowerCase().includes(lowered) ||
      stripHtml(post.content).toLowerCase().includes(lowered)
    );
    setFilteredPosts(results)
  }, 300), [posts]);

  useEffect(() => {
    debouncedFilter(searchQuery)

    return () => debouncedFilter.cancel()
  }, [searchQuery, debouncedFilter])

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>

      <input
        type="text" 
        placeholder="Search by title or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border p-2 rounded mb-6"
      />

      {filteredPosts.length === 0 && (
        <p className="text-gray-500">No posts found. Try a different keyword!</p>
      )}

      {filteredPosts.map((post) => (
        <Link
          to={`/post/${post.$id}`}
          key={post.$id}
          className="block bg-white shadow-md rounded p-4 mb-6 hover:bg-gray-50 transition"
        >
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-2">
            {new Date(post.$createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            {stripHtml(post.content).substring(0,150)}...
          </p>
        </Link>
      ))}
    </div>
  )
}

function stripHtml(html){
  return html.replace(/<[^>]+>/g, '');
}