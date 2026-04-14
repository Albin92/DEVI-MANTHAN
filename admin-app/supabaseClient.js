// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joqjqxymowcrycjvnbks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcWpxeHltb3djcnljanZuYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTYzNjUsImV4cCI6MjA5MTY3MjM2NX0.UIFQhmWv7M7zvo5BW5Q6B4iwptSlxDdMMuPTsw8BK6I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);