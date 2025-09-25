-- Fix the get_match_messages function to resolve column reference ambiguity
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION get_match_messages(match_id UUID, user_id UUID)
RETURNS TABLE (
    id UUID,
    sender_id UUID,
    message_text TEXT,
    message_type TEXT,
    attachment_url TEXT,
    attachment_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Verify user is part of this match (use table alias to avoid ambiguity)
    IF NOT EXISTS (
        SELECT 1 FROM matches m
        WHERE m.id = get_match_messages.match_id AND (m.user1_id = user_id OR m.user2_id = user_id)
    ) THEN
        RAISE EXCEPTION 'User not authorized to view these messages';
    END IF;
    
    RETURN QUERY
    SELECT m.id, m.sender_id, m.message_text, m.message_type, 
           m.attachment_url, m.attachment_type, m.created_at, m.read_at
    FROM messages m
    WHERE m.match_id = get_match_messages.match_id
    ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
