-- Fix the accept_match_request function to resolve column reference ambiguity
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION accept_match_request(request_id UUID, accepter_id UUID)
RETURNS UUID AS $$
DECLARE
    match_id UUID;
    req_id UUID;
    targ_id UUID;
BEGIN
    -- Get the request details with aliased column names
    SELECT requester_id, target_id INTO req_id, targ_id
    FROM match_requests 
    WHERE id = request_id AND target_id = accepter_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Match request not found or not authorized';
    END IF;
    
    -- Update the request status
    UPDATE match_requests 
    SET status = 'accepted', responded_at = NOW()
    WHERE id = request_id;
    
    -- Create the match (ensure user1_id < user2_id)
    IF req_id < targ_id THEN
        INSERT INTO matches (user1_id, user2_id)
        VALUES (req_id, targ_id)
        RETURNING id INTO match_id;
    ELSE
        INSERT INTO matches (user1_id, user2_id)
        VALUES (targ_id, req_id)
        RETURNING id INTO match_id;
    END IF;
    
    RETURN match_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
