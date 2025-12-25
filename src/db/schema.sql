-- Philosophizer Database Schema
-- PostgreSQL 16+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================================================
-- Users Table
-- ==========================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================================================
-- Magic Links Table (for passwordless authentication)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS magic_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_user_id ON magic_links(user_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON magic_links(expires_at);


-- ==========================================================================
-- Triggers
-- ==========================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================================================
-- Cleanup function for expired magic links (optional)
-- ==========================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
    DELETE FROM magic_links 
    WHERE expires_at < CURRENT_TIMESTAMP 
    AND used_at IS NULL;
END;
$$ LANGUAGE 'plpgsql';

-- ==========================================================================
-- Philosopher Text Chunks Table (RAG System)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS philosopher_text_chunks (
    id VARCHAR(255) PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL, -- nomic-embed-text produces 768-dimensional vectors
    philosopher VARCHAR(255) NOT NULL,
    source_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    start_char INTEGER DEFAULT 0,
    end_char INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_philosopher_text_chunks_philosopher ON philosopher_text_chunks(philosopher);
CREATE INDEX IF NOT EXISTS idx_philosopher_text_chunks_source_id ON philosopher_text_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_philosopher_text_chunks_chunk_index ON philosopher_text_chunks(chunk_index);

-- Vector similarity index using HNSW for fast approximate nearest neighbor search
-- Using cosine distance for semantic similarity
CREATE INDEX IF NOT EXISTS idx_philosopher_text_chunks_embedding ON philosopher_text_chunks 
USING hnsw (embedding vector_cosine_ops);

-- ==========================================================================
-- Conversations Table (with semantic search support)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    embedding vector(768), -- Embedding of title + conversation content for semantic search
    content_preview TEXT, -- First 500 chars of conversation for quick preview
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

-- Vector similarity index for conversation semantic search
CREATE INDEX IF NOT EXISTS idx_conversations_embedding ON conversations 
USING hnsw (embedding vector_cosine_ops);

-- ==========================================================================
-- Conversation Messages Table
-- ==========================================================================
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    parts JSONB, -- Store additional message parts as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);

-- ==========================================================================
-- Additional Triggers
-- ==========================================================================
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

