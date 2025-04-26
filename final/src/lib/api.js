import { supabase } from '../client'

export const getPosts = async (searchQuery = '', sortBy = 'recent') => {
  console.log('Fetching posts...')
  const query = supabase
    .from('posts')
    .select('*')
  
  // Add search filter if query exists
  if (searchQuery) {
    query.ilike('title', `%${searchQuery}%`)
  }

  // Add sorting
  if (sortBy === 'recent') {
    query.order('created_at', { ascending: false })
  } else if (sortBy === 'popular') {
    query.order('votes_count', { ascending: false, nullsFirst: false })
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
  console.log('Fetched posts:', data)

  return data
}

export const createPost = async ({ title, content }) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const getPost = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const updatePost = async (id, { title, content, image_url }) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ title, content, image_url, updated_at: new Date() })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deletePost = async (id) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const createComment = async ({ post_id, content }) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, content }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteComment = async (id) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const addVote = async (post_id) => {
  // First check if votes_count exists, if not initialize it
  const { data: post } = await supabase
    .from('posts')
    .select('votes_count')
    .eq('id', post_id)
    .single();

  if (post.votes_count === null) {
    // Initialize votes_count if it's null
    await supabase
      .from('posts')
      .update({ votes_count: 0 })
      .eq('id', post_id);
  }

  // Now increment the vote
  const { data, error } = await supabase
    .rpc('increment_votes', { post_id })
  
  if (error) {
    console.error('Error in addVote:', error);
    throw error;
  }
  
  // Return the updated post
  const { data: updatedPost, error: fetchError } = await supabase
    .from('posts')
    .select('votes_count')
    .eq('id', post_id)
    .single();
    
  if (fetchError) throw fetchError;
  return updatedPost.votes_count;
}
